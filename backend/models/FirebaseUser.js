// Firebase User Operations
const { db, auth } = require('../config/firebase');

const userCollectionRef = db.collection('users');

class FirebaseUserModel {
  // Create new user
  static async create(userData) {
    try {
      const { email, password, firstName, lastName, phone, dateOfBirth, education, experience } = userData;
      
      // Create auth user
      const authUser = await auth.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`
      });
      
      // Create user profile in Firestore
      await userCollectionRef.doc(authUser.uid).set({
        uid: authUser.uid,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        education,
        experience,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        isAdmin: email === process.env.ADMIN_EMAIL,
        profileStatus: 'active',
        profileData: {
          bio: '',
          skills: [],
          certifications: [],
          portfolioUrl: '',
          preferredJobTitle: '',
          preferredLocation: '',
          expectedSalary: ''
        },
        applications: [],
        registeredDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      return {
        uid: authUser.uid,
        email: authUser.email,
        firstName,
        isAdmin: email === process.env.ADMIN_EMAIL
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async findById(uid) {
    try {
      const doc = await userCollectionRef.doc(uid).get();
      if (!doc.exists) return null;
      return doc.data();
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async findByEmail(email) {
    try {
      const query = await userCollectionRef.where('email', '==', email).get();
      if (query.empty) return null;
      return query.docs[0].data();
    } catch (error) {
      throw error;
    }
  }

  // Update user
  static async update(uid, data) {
    try {
      await userCollectionRef.doc(uid).update(data);
      return await this.findById(uid);
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  static async delete(uid) {
    try {
      await auth.deleteUser(uid);
      await userCollectionRef.doc(uid).delete();
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async getAll(limit = 10, offset = 0) {
    try {
      const query = await userCollectionRef
        .orderBy('registeredDate', 'desc')
        .limit(limit + 1)
        .offset(offset)
        .get();
      
      const users = query.docs.map(doc => doc.data());
      return {
        users: users.slice(0, limit),
        hasMore: users.length > limit
      };
    } catch (error) {
      throw error;
    }
  }

  // Search users
  static async search(searchTerm, limit = 10, offset = 0) {
    try {
      const allUsers = await userCollectionRef.get();
      const results = allUsers.docs
        .map(doc => doc.data())
        .filter(user => 
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.registeredDate) - new Date(a.registeredDate))
        .slice(offset, offset + limit);
      
      return {
        users: results,
        hasMore: allUsers.size > offset + limit
      };
    } catch (error) {
      throw error;
    }
  }

  // Filter by status
  static async filterByStatus(status, limit = 10, offset = 0) {
    try {
      const query = await userCollectionRef
        .where('profileStatus', '==', status)
        .orderBy('registeredDate', 'desc')
        .limit(limit + 1)
        .offset(offset)
        .get();
      
      const users = query.docs.map(doc => doc.data());
      return {
        users: users.slice(0, limit),
        hasMore: users.length > limit
      };
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats() {
    try {
      const allUsers = await userCollectionRef.get();
      const users = allUsers.docs.map(doc => doc.data());
      
      const activeUsers = users.filter(u => u.profileStatus === 'active').length;
      const inactiveUsers = users.filter(u => u.profileStatus === 'inactive').length;
      const suspendedUsers = users.filter(u => u.profileStatus === 'suspended').length;
      const usersWithApplications = users.filter(u => u.applications.length > 0).length;
      
      // Count applications by status
      const appStatusCount = {};
      users.forEach(user => {
        user.applications.forEach(app => {
          appStatusCount[app.status] = (appStatusCount[app.status] || 0) + 1;
        });
      });
      
      const applications = Object.entries(appStatusCount).map(([status, count]) => ({
        _id: status,
        count
      }));
      
      return {
        totalUsers: users.length,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        usersWithApplications,
        applications
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FirebaseUserModel;
