
export interface IWorkOrder {
   workOrderId: number;
   workOrderCode: string;
   workOrderStatus: string;
   estimateDuration: number;
   executionDuration: number;
   rate: number;
   totalCost: number;
   percentage: number;
   notes: string;
   responsibleId: number;
   responsibleName: string;
   generatedById: number;
   generatedByName: string;
   equipments: IWorkQueueEquipment[];
}

export interface IWorkQueueEquipment {
   equipmentId: number;
   name: string;
   code: string;
   taskCount: number;
   maintenanceCount: number;
   workQueueTasks: IWorkOrderTask[];
}

// export interface IWorkOrderTaskProgress {
//    assetId: number;
//    assetName: string;
//    taskId: number;
//    taskName: string;
//    startDate: string;
//    endDate: string;
//    duration: number;
//    notes: string;
//    status: string;
// }

export interface IWorkOrderTask {
   workQueueTaskId: number;
   rescheduledDate: string;
   scheduledDate: string;
   status: string;
   taskName: string;
   taskDuration: number;
   taskPriority: number;
   taskCategoryId: number;
   taskCategoryName: string;
   triggerDescription: string;
   taskId: number;
   taskTriggerId: number;
   startDate: string;
   endDate: string;
   duration: number;
   notes: string;
   taskResources: IWorkOrderResource[];
   subTasks: IWorkOrderSubTask[];
   valid: boolean;
}

export interface IWorkOrderResource {
   workOrderResourceId: number;
   description: string;
   resource: string;
   itemId: number;
   inventoryItemId: number;
   employeeCategoryId: number;
   personId: number;
   resourceType: string;
   amount: number;
}

export interface IWorkOrderSubTask {
   workOrderSubTaskId: number;
   subTaskId: number;
   subTaskCategoryKey: string;
   subTaskDescription: string;
   value: string;
}

export const getIWorkOrderDefaultInstance = ():IWorkOrder => ({
   workOrderId: 0,
   workOrderCode: '',
   workOrderStatus: '',
   estimateDuration: 0,
   executionDuration: 0,
   rate: 0,
   totalCost: 0,
   percentage: 0,
   notes: '',
   responsibleId: 0,
   responsibleName: '',
   generatedById: 0,
   generatedByName: '',
   equipments: [],
});

export const getIWorkOrderTaskDefaultInstance = ():IWorkOrderTask => ({
   workQueueTaskId: 0,
   rescheduledDate: '',
   scheduledDate: '',
   status: '',
   taskName: '',
   taskDuration: 0,
   taskPriority: 0,
   taskCategoryId: 0,
   taskCategoryName: '',
   triggerDescription: '',
   taskId: 0,
   taskTriggerId: 0,
   startDate: '',
   endDate: '',
   duration: 0,
   notes: '',
   taskResources: [],
   subTasks: [],
   valid: false
});
