import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'dart:convert';

/**
 * C18: Local Database Service for Offline Persistence
 * Caches critical data for offline access
 */
class LocalDatabase {
  static final LocalDatabase _instance = LocalDatabase._internal();
  factory LocalDatabase() => _instance;
  
  Database? _database;
  
  LocalDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'aura_one_offline.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // Vitals cache
    await db.execute('''
      CREATE TABLE vitals_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL
      )
    ''');

    // Medications cache
    await db.execute('''
      CREATE TABLE medications_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        data TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL
      )
    ''');

    // Chat messages cache
    await db.execute('''
      CREATE TABLE messages_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        sender_type TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'TEXT',
        synced INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL
      )
    ''');

    // Sync queue for offline actions
    await db.execute('''
      CREATE TABLE sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        payload TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    ''');
  }

  // C18: Cache vitals data
  Future<void> cacheVitals(int patientId, Map<String, dynamic> vitals) async {
    final db = await database;
    await db.insert('vitals_cache', {
      'patient_id': patientId,
      'data': jsonEncode(vitals),
      'synced': 0,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  // C18: Get cached vitals
  Future<Map<String, dynamic>?> getCachedVitals(int patientId) async {
    final db = await database;
    final results = await db.query(
      'vitals_cache',
      where: 'patient_id = ?',
      whereArgs: [patientId],
      orderBy: 'timestamp DESC',
      limit: 1,
    );

    if (results.isEmpty) return null;
    return jsonDecode(results.first['data'] as String);
  }

  // C18: Cache medications
  Future<void> cacheMedications(int patientId, List<dynamic> medications) async {
    final db = await database;
    await db.insert('medications_cache', {
      'patient_id': patientId,
      'data': jsonEncode(medications),
      'synced': 1, // Already from server
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  // C18: Get cached medications
  Future<List<dynamic>?> getCachedMedications(int patientId) async {
    final db = await database;
    final results = await db.query(
      'medications_cache',
      where: 'patient_id = ?',
      whereArgs: [patientId],
      orderBy: 'timestamp DESC',
      limit: 1,
    );

    if (results.isEmpty) return null;
    return jsonDecode(results.first['data'] as String);
  }

  // C18: Cache chat message for offline send
  Future<void> cacheMessage(
    int conversationId,
    int senderId,
    String senderType,
    String content,
    String type,
  ) async {
    final db = await database;
    await db.insert('messages_cache', {
      'conversation_id': conversationId,
      'sender_id': senderId,
      'sender_type': senderType,
      'content': content,
      'type': type,
      'synced': 0,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  // C18: Queue action for sync when online
  Future<void> queueAction(String actionType, String endpoint, Map<String, dynamic> payload) async {
    final db = await database;
    await db.insert('sync_queue', {
      'action_type': actionType,
      'endpoint': endpoint,
      'payload': jsonEncode(payload),
      'retry_count': 0,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  // C18: Get pending sync items
  Future<List<Map<String, dynamic>>> getPendingSyncItems() async {
    final db = await database;
    return await db.query(
      'sync_queue',
      where: 'retry_count < ?',
      whereArgs: [3], // Max 3 retries
      orderBy: 'created_at ASC',
    );
  }

  // C18: Mark sync item as completed
  Future<void> markSynced(int id) async {
    final db = await database;
    await db.delete('sync_queue', where: 'id = ?', whereArgs: [id]);
  }

  // C18: Increment retry count
  Future<void> incrementRetry(int id) async {
    final db = await database;
    await db.rawUpdate(
      'UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?',
      [id],
    );
  }

  // C18: Clear all cached data (for logout)
  Future<void> clearAll() async {
    final db = await database;
    await db.delete('vitals_cache');
    await db.delete('medications_cache');
    await db.delete('messages_cache');
    await db.delete('sync_queue');
  }
}
