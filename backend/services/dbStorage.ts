import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.ts';
import { Program } from '../models/Program.ts';
import { Project } from '../models/Project.ts';
import { Story } from '../models/Story.ts';
import { News } from '../models/News.ts';
import { Event } from '../models/Event.ts';
import { Gallery } from '../models/Gallery.ts';
import { TeamMember } from '../models/TeamMember.ts';
import { Volunteer } from '../models/Volunteer.ts';
import { Donation } from '../models/Donation.ts';
import { ContactMessage } from '../models/ContactMessage.ts';
import { WebsiteSettings } from '../models/WebsiteSettings.ts';
import { ActivityLog } from '../models/ActivityLog.ts';
import {
  initialSettings,
  initialPrograms,
  initialProjects,
  initialStories,
  initialNews,
  initialEvents,
  initialGallery,
  initialTeam,
  initialAdmin,
} from '../utils/seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection: string): any[] {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeCollection(collection: string, data: any[]) {
  const file = getFilePath(collection);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

export const dbStorage = {
  isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  },

  async init() {
    const users = readCollection('users');
    if (users.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(initialAdmin.password, salt);
      const defaultAdmin = {
        _id: 'admin_super_01',
        name: initialAdmin.name,
        email: initialAdmin.email,
        password: hashedPassword,
        role: initialAdmin.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCollection('users', [defaultAdmin]);
    }

    if (readCollection('programs').length === 0) {
      const programs = initialPrograms.map((p, idx) => ({
        _id: `prog_${idx + 1}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('programs', programs);
    }

    if (readCollection('projects').length === 0) {
      const projects = initialProjects.map((p, idx) => ({
        _id: `proj_${idx + 1}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('projects', projects);
    }

    if (readCollection('stories').length === 0) {
      const stories = initialStories.map((s, idx) => ({
        _id: `story_${idx + 1}`,
        ...s,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('stories', stories);
    }

    if (readCollection('news').length === 0) {
      const news = initialNews.map((n, idx) => ({
        _id: `news_${idx + 1}`,
        ...n,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('news', news);
    }

    if (readCollection('events').length === 0) {
      const events = initialEvents.map((e, idx) => ({
        _id: `event_${idx + 1}`,
        ...e,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('events', events);
    }

    if (readCollection('gallery').length === 0) {
      const gallery = initialGallery.map((g, idx) => ({
        _id: `gal_${idx + 1}`,
        ...g,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('gallery', gallery);
    }

    if (readCollection('team').length === 0) {
      const team = initialTeam.map((t, idx) => ({
        _id: `team_${idx + 1}`,
        ...t,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      writeCollection('team', team);
    }

    const settings = readCollection('settings');
    if (settings.length === 0) {
      const initial = {
        _id: 'settings_singleton_01',
        ...initialSettings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeCollection('settings', [initial]);
    }

    // Also seed Mongoose if Mongo is connected
    if (this.isMongoConnected()) {
      try {
        const count = await Program.countDocuments();
        if (count === 0) {
          await Program.insertMany(initialPrograms);
          await Project.insertMany(initialProjects);
          await Story.insertMany(initialStories);
          await News.insertMany(initialNews);
          await Event.insertMany(initialEvents);
          await Gallery.insertMany(initialGallery);
          await TeamMember.insertMany(initialTeam);
          await WebsiteSettings.create(initialSettings);

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(initialAdmin.password, salt);
          await User.create({
            ...initialAdmin,
            password: hashedPassword,
          });
          console.log('[Database] MongoDB Atlas seeded with initial foundation models.');
        }
      } catch (err) {
        console.warn('[Database] Mongoose seed notice:', err);
      }
    }
  },

  async find(collection: string, filter: any = {}, options: { sort?: any; limit?: number; skip?: number } = {}) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model) {
        let q = model.find(filter);
        if (options.sort) q = q.sort(options.sort);
        if (options.skip) q = q.skip(options.skip);
        if (options.limit) q = q.limit(options.limit);
        return await q.exec();
      }
    }

    let items = readCollection(collection);

    // Apply simple filtering
    items = items.filter((item) => {
      for (const key of Object.keys(filter)) {
        if (filter[key] === undefined) continue;
        if (key === '$or' && Array.isArray(filter[key])) {
          const matchOr = filter[key].some((subF: any) => {
            return Object.keys(subF).some((subKey) => {
              const val = subF[subKey];
              if (val instanceof RegExp) {
                return val.test(String(item[subKey] || ''));
              }
              return item[subKey] === val;
            });
          });
          if (!matchOr) return false;
        } else if (filter[key] instanceof RegExp) {
          if (!filter[key].test(String(item[key] || ''))) return false;
        } else if (typeof filter[key] === 'object' && filter[key] !== null) {
          // simple sub-check
          if (filter[key].$regex) {
            const rx = new RegExp(filter[key].$regex, filter[key].$options || 'i');
            if (!rx.test(String(item[key] || ''))) return false;
          }
        } else if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });

    // Apply sorting
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortDir = options.sort[sortKey];
      items.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (sortDir === -1) {
          return valA > valB ? -1 : 1;
        }
        return valA > valB ? 1 : -1;
      });
    }

    if (options.skip) {
      items = items.slice(options.skip);
    }
    if (options.limit) {
      items = items.slice(0, options.limit);
    }

    return items;
  },

  async count(collection: string, filter: any = {}) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model) return await model.countDocuments(filter);
    }
    const items = await this.find(collection, filter);
    return items.length;
  },

  async findOne(collection: string, filter: any = {}) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model) return await model.findOne(filter);
    }
    const items = await this.find(collection, filter, { limit: 1 });
    return items[0] || null;
  },

  async findById(collection: string, id: string) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model && mongoose.Types.ObjectId.isValid(id)) {
        return await model.findById(id);
      }
    }
    const items = readCollection(collection);
    return items.find((item) => String(item._id) === String(id) || String(item.id) === String(id)) || null;
  },

  async create(collection: string, data: any) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model) {
        return await model.create(data);
      }
    }

    const items = readCollection(collection);
    const newItem = {
      _id: data._id || `${collection.slice(0, 4)}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    writeCollection(collection, items);
    return newItem;
  },

  async findByIdAndUpdate(collection: string, id: string, updateData: any) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model && mongoose.Types.ObjectId.isValid(id)) {
        return await model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      }
    }

    const items = readCollection(collection);
    const index = items.findIndex((i) => String(i._id) === String(id) || String(i.id) === String(id));
    if (index === -1) return null;

    const existing = items[index];
    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    writeCollection(collection, items);
    return updated;
  },

  async findByIdAndDelete(collection: string, id: string) {
    if (this.isMongoConnected()) {
      const model = this.getModel(collection);
      if (model && mongoose.Types.ObjectId.isValid(id)) {
        return await model.findByIdAndDelete(id);
      }
    }

    const items = readCollection(collection);
    const index = items.findIndex((i) => String(i._id) === String(id) || String(i.id) === String(id));
    if (index === -1) return null;

    const [deleted] = items.splice(index, 1);
    writeCollection(collection, items);
    return deleted;
  },

  getModel(collection: string): any {
    switch (collection) {
      case 'users':
        return User;
      case 'programs':
        return Program;
      case 'projects':
        return Project;
      case 'stories':
        return Story;
      case 'news':
        return News;
      case 'events':
        return Event;
      case 'gallery':
        return Gallery;
      case 'team':
        return TeamMember;
      case 'volunteers':
        return Volunteer;
      case 'donations':
        return Donation;
      case 'contact':
      case 'messages':
        return ContactMessage;
      case 'settings':
        return WebsiteSettings;
      case 'logs':
        return ActivityLog;
      default:
        return null;
    }
  },
};
