import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/cupertino.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../services/api_service.dart';
import '../widgets/care_task_card.dart';

class NurseDashboardScreen extends StatefulWidget {
  const NurseDashboardScreen({super.key});

  @override
  State<NurseDashboardScreen> createState() => _NurseDashboardScreenState();
}

class _NurseDashboardScreenState extends State<NurseDashboardScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = true;
  List<dynamic> _tasks = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    // Non-destructive refresh
    if (_tasks.isEmpty) {
        setState(() => _isLoading = true);
    }
    setState(() => _error = null);

    try {
      final tasks = await ApiService().getCareTasks();
      if (mounted) {
        setState(() {
          _tasks = tasks;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceAll('Exception:', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _updateTaskStatus(int id, String status, String? notes) async {
    try {
      await ApiService().updateCareTask(id, status, notes: notes);
      
      // Optimistic update
      setState(() {
        final index = _tasks.indexWhere((t) => t['id'] == id);
        if (index != -1) {
          _tasks[index]['status'] = status;
          if (status == 'COMPLETED' || status == 'SKIPPED') {
             // Move to completed tab conceptually, or just refetch
             // Ideally we just refetch to let backend sort
          }
        }
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Task marked as $status'),
          behavior: SnackBarBehavior.floating,
          backgroundColor: status == 'COMPLETED' ? AppColors.success : Colors.grey,
        )
      );

      _loadTasks(); // Refetch to re-sort
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update task: $e'), backgroundColor: AppColors.error)
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Nurse Dashboard', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.background,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(CupertinoIcons.bell, color: Colors.white),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(CupertinoIcons.person_circle, color: Colors.white),
            onPressed: () => context.go('/'), // Logout
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          labelColor: AppColors.primary,
          unselectedLabelColor: Colors.grey,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold),
          tabs: const [
            Tab(text: 'My Tasks'),
            Tab(text: 'Critical'),
            Tab(text: 'Completed'),
          ],
        ),
      ),
      body: _isLoading && _tasks.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : _error != null && _tasks.isEmpty
              ? Center(child: Text(_error!, style: const TextStyle(color: AppColors.error)))
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildTaskList(statusFilter: ['PENDING', 'IN_PROGRESS']), // My Tasks
                    _buildTaskList(priorityFilter: 'CRITICAL', statusFilter: ['PENDING', 'IN_PROGRESS']), // Critical
                    _buildTaskList(statusFilter: ['COMPLETED', 'SKIPPED']), // Completed
                  ],
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
            // TODO: Create manual task dialog
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Create Task Dialog - Coming Soon')));
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildTaskList({List<String>? statusFilter, String? priorityFilter}) {
     List<dynamic> filteredTasks = _tasks.where((t) {
       final statusMatch = statusFilter == null || statusFilter.contains(t['status']);
       final priorityMatch = priorityFilter == null || t['priority'] == priorityFilter;
       return statusMatch && priorityMatch;
     }).toList();

     if (filteredTasks.isEmpty) {
         return Center(
           child: Column(
             mainAxisAlignment: MainAxisAlignment.center,
             children: [
               Icon(CupertinoIcons.checkmark_shield, size: 64, color: Colors.white.withOpacity(0.1)),
               const SizedBox(height: 16),
               Text('No tasks found.', style: AppTypography.bodyMedium.copyWith(color: AppColors.textSecondary)),
             ],
           ),
         );
     }

     return RefreshIndicator(
       onRefresh: _loadTasks,
       child: ListView.builder(
           padding: const EdgeInsets.only(bottom: 80),
           itemCount: filteredTasks.length,
           itemBuilder: (context, index) {
               final task = filteredTasks[index];
               return CareTaskCard(
                 task: task,
                 onUpdateStatus: (status, notes) => _updateTaskStatus(task['id'], status, notes),
               );
           },
       ),
     );
  }
}
