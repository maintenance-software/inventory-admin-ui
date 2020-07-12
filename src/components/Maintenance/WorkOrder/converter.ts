import {WorkQueueQL} from "../../../graphql/WorkOrder.ql";
import {IWorkOrderResource, IWorkQueueEquipment} from "./WorkOrderTypes";
import {buildFullName} from "../../../utils/globalUtil";
import {TaskResourceQL} from "../../../graphql/Maintenance.ql";

export const workQueuesConverter = (workQueues: WorkQueueQL[]):IWorkQueueEquipment[] => {
   const workOrderEquipments: IWorkQueueEquipment[] = [];

   workQueues.forEach(wq => {
      let workOrderEquipment = workOrderEquipments.find(woe => woe.equipmentId === wq.equipment.equipmentId);
      if(!workOrderEquipment) {
         workOrderEquipment = {
            equipmentId: wq.equipment.equipmentId,
            name: wq.equipment.name,
            code: wq.equipment.code,
            taskCount: 0,
            maintenanceCount: 0,
            workQueueTasks: []
         };
         workOrderEquipments.push(workOrderEquipment);
      }

      workOrderEquipment.workQueueTasks.push({
         workQueueTaskId: wq.workQueueId,
         rescheduledDate: wq.rescheduledDate,
         scheduledDate: wq.scheduledDate,
         status: wq.status,
         taskId: wq.task.taskId,
         taskName: wq.task.name + '_' + wq.workQueueId,
         taskDuration: wq.task.duration,
         taskPriority: wq.task.priority,
         taskCategoryId: wq.task.taskCategory? wq.task.taskCategory.categoryId : 0,
         taskCategoryName: wq.task.taskCategory? wq.task.taskCategory.name: '',
         triggerDescription: wq.taskTrigger.description,
         taskTriggerId: wq.taskTrigger.taskTriggerId,
         startDate: wq.startWorkDate,
         endDate: wq.finishedWorkDate,
         duration: 0,
         notes: wq.notes,
         taskResources: wq.workOrderResources? wq.workOrderResources.map(r => ({
            workOrderResourceId: r.workOrderResourceId,
            description: '',
            resource: r.humanResource? buildFullName(r.humanResource.firstName, r.humanResource.lastName) : r.inventoryItem.item.name,
            itemId: r.inventoryItem ? r.inventoryItem.item.itemId : 0,
            inventoryItemId: r.inventoryItem? r.inventoryItem.inventoryItemId : 0,
            employeeCategoryId: 0,
            personId: r.humanResource? r.humanResource.personId : 0,
            resourceType: r.humanResource? 'HUMAN' : 'INVENTORY',
            amount: r.amount,
         })) : [],
         subTasks: wq.workOrderSubTask? wq.workOrderSubTask.map(t => ({
            workOrderSubTaskId: t.workOrderSubTaskId,
            subTaskId: t.subTask.subTaskId,
            subTaskCategoryKey: t.subTask.subTaskCategory.key,
            subTaskDescription: '',
            value: t.value
         })) : [],
         valid: true
      });
   });
   return workOrderEquipments;
};

export const workOrderResourceConverter = (resources: TaskResourceQL[]): IWorkOrderResource[] => {
   let workOrderResources: IWorkOrderResource[] = [];
   let index = 0;
   resources.forEach(r => {
      if(r.resourceType === 'INVENTORY' && r.inventoryResource) {
         workOrderResources.push({
            workOrderResourceId: -index,
            description: r.inventoryResource.name,
            resource: '',
            itemId: r.inventoryResource.itemId,
            inventoryItemId: 0,
            employeeCategoryId: 0,
            personId: 0,
            resourceType: 'INVENTORY',
            amount: r.amount
         });
         index++;
      } else if(r.resourceType === 'HUMAN' && r.employeeCategory) {
         const humanResources: IWorkOrderResource[] = [];
         for (let i = 0; i < r.amount; i++) {
            humanResources.push({
               workOrderResourceId: -index,
               description: r.employeeCategory.name,
               resource: '',
               itemId: 0,
               inventoryItemId: 0,
               employeeCategoryId: r.employeeCategory.categoryId,
               personId: 0,
               resourceType: 'HUMAN',
               amount: 1
            });
            index++;
         }
         workOrderResources = workOrderResources.concat(humanResources);
      }
   });
   return workOrderResources;
};


/*
         const resources: WorkOrderResourceQL[] = []; //data.workOrders.workOrder.workOrderResources;
         const subTasks: WorkOrderSubTaskQL[] = []; //data.workOrders.workOrder.workOrderSubTask;
equipments: bWorkOrder.equipments.map(e => ({
               equipmentId: e.equipmentId,
               name: e.name,
               code: e.code,
               taskCount: 0,
               maintenanceCount: 0,
               workOrderTasks: e.workQueues.map(wq => ({
                  workOrderTaskId: wq.workQueueId,
                  rescheduledDate: wq.rescheduledDate,
                  scheduledDate: wq.scheduledDate,
                  status: wq.status,
                  taskId: wq.task.taskId,
                  taskName: wq.task.name,
                  taskPriority: wq.task.priority,
                  taskCategoryId: wq.task.taskCategory? wq.task.taskCategory.categoryId : 0,
                  taskCategoryName: wq.task.taskCategory? wq.task.taskCategory.name: '',
                  triggerDescription: wq.taskTrigger.description,
                  taskTriggerId: wq.taskTrigger.taskTriggerId,
                  startDate: wq.startWorkDate,
                  endDate: wq.finishedWorkDate,
                  duration: 30,
                  notes: wq.notes,
                  taskResources: resources.filter(r => r.workQueue.workQueueId === wq.workQueueId).map(r => ({
                     resourceId: r.workOrderResourceId,
                     description: '',
                     resource: r.humanResource? buildFullName(r.humanResource.firstName, r.humanResource.lastName) : r.inventoryItem.item.name,
                     itemId: r.inventoryItem ? r.inventoryItem.item.itemId : 0,
                     inventoryItemId: r.inventoryItem? r.inventoryItem.inventoryItemId : 0,
                     employeeCategoryId: 0,
                     personId: r.humanResource? r.humanResource.personId : 0,
                     resourceType: r.humanResource? 'HUMAN' : 'INVENTORY',
                     amount: r.amount,
                  })),
                  subTasks: subTasks.filter(t => t.workQueue.workQueueId === wq.workQueueId).map(t => ({
                     workOrderSubTaskId: t.workOrderSubTaskId,
                     subTaskId: t.subTask.subTaskId,
                     subTaskDescription: '',
                     value: ''
                  })),
                  valid: true
               }))
            })),
 */
