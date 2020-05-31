import {gql} from 'apollo-boost';
import {getPersonDefaultInstance, PersonQL} from "./Person.ql";

export interface WorkOrderQL {
   workOrderId: number;
   workOrderCode: string;
   workOrderStatus: string;
   estimateDuration: number;
   executionDuration: number;
   rate: number;
   totalCost: number;
   percentage: number;
   notes: string;
   generatedBy: PersonQL;
   responsible: PersonQL;
   parent?: WorkOrderQL;
   createdDate: string;
   modifiedDate: string;
}

export const getWorkOrderDefaultInstance = ():WorkOrderQL => ({
   workOrderId: 0,
   workOrderCode: '',
   workOrderStatus: '',
   estimateDuration: 0,
   executionDuration: 0,
   rate: 0,
   totalCost: 0,
   percentage: 0,
   notes: '',
   generatedBy: getPersonDefaultInstance(),
   responsible: getPersonDefaultInstance(),
   createdDate: '',
   modifiedDate: ''
});

export const FETCH_WORK_ORDERS_QL = gql`
   query fetchWorkOrders {
      maintenances {
         workOrders {
            content {
               workOrderId
               workOrderCode
               workOrderStatus
               responsible {
                  personId
                  firstName
                  lastName
               }
               percentage
            }
            totalCount
            pageInfo {
               hasNext
               hasPreview
               pageSize
               pageIndex
            }
         }
         
      }
   }
`;

export const GET_WORK_ORDER_BY_ID_QL = gql`
   query getWorkOrderById($workOrderId: Int!) {
      maintenances {
         workOrder(entityId: $workOrderId) {
            workOrderId
            workOrderCode
            workOrderStatus
            estimateDuration
            executionDuration
            rate
            totalCost
            percentage
            notes
            generatedBy {
               personId
               firstName
               lastName
            }
            responsible {
               personId
               firstName
               lastName
            }
            createdDate
            modifiedDate
         }
      }
   }
`;

export const SAVE_WORK_ORDER_QL = gql`
   mutation saveWorkOrder(
        $workOrderId: Int!,
        $workOrderStatus: String!,
        $estimateDuration: Int!,
        $executionDuration: Int!,
        $rate: Int!,
        $notes: String!,
        $generatedById: Int!,
        $responsibleId: Int!,
        $activityIds: [Int!]!
   ) {
      maintenances {
         createUpdateWorkOrder(
            workOrderId: $workOrderId,
            workOrderStatus: $workOrderStatus,
            estimateDuration: $estimateDuration,
            executionDuration: $executionDuration,
            rate: $rate,
            notes: $notes,
            generatedById: $generatedById,
            responsibleId: $responsibleId,
            activityIds: $activityIds,    
         ) {
            workOrderId            
         }
      }
   }
`;
