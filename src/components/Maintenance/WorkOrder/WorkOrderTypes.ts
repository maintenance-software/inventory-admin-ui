import {EntityStatusQL} from "../../../graphql/User.ql";

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
   equipments: IWorkOrderEquipment[];
}

export interface IWorkOrderEquipment {
   equipmentId: number;
   name: string;
   code: string;
   taskCount: number;
   maintenanceCount: number;
   workOrderTasks: IWorkOrderTask[];
}

interface IWorkOrderTask {
   workOrderTaskId: number;
   rescheduledDate: string;
   scheduledDate: string;
   status: string;
   taskName: string;
   taskPriority: number;
   taskCategoryId: number;
   taskCategoryName: string;
   triggerDescription: string;
   taskId: number;
   taskTriggerId: number;
   taskResources: IWorkOrderResource[];
   valid: boolean;
}

export interface IWorkOrderResource {
   resourceId: number;
   description: string;
   resource: string;
   itemId: number;
   inventoryItemId: number;
   employeeCategoryId: number;
   personId: number;
   resourceType: string;
   amount: number;
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
