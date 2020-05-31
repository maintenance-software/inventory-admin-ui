import {gql} from 'apollo-boost';
import {PageQL} from "./Common.ql";
import {EntityStatusQL} from "./User.ql";
import {ItemQL, ItemTypeQL} from "./Item.ql";

export interface PersonsQL {
   person: PersonQL;
   list: PersonQL[];
}

export interface PersonQL {
   personId: number;
   firstName: string;
   lastName: string;
   documentType: string;
   documentId: string;
   address: AddressQL | null;
   contactInfo: ContactInfoQL[];
}

export interface AddressQL {
   addressId: number;
   street1: string;
   street2: string;
   street3: string;
   zip: string;
   city: string;
   state: string;
   country: string;
}

export interface ContactInfoQL {
   contactId: number;
   contact: string;
   contactType: string;
}

export enum ContactTypeQL{
   EMAIL = 'EMAIL',
   WORK_PHONE = 'WORK_PHONE',
   CELL_PHONE = 'CELL_PHONE',
   WHATSAPP = 'WHATSAPP'
}

export interface IEmployeesQL {
   employee: IEmployeeQL;
   page: PageQL<IEmployeeQL>;
   saveEmployee: IEmployeeQL;
}

export interface IEmployeeQL {
   employeeId: number;
   firstName: string;
   lastName: string;
   documentType: string;
   documentId: string;
   hireDate: string;
   salary: number;
   employeeJob: IEmployeeJobQL;
   address: AddressQL;
   contactInfo: ContactInfoQL[];
   createdDate: string;
   modifiedDate: string;
}

export interface  IEmployeeJobQL {
   employeeJobId: number;
   tittle: string;
   description: string;
   createdDate: string;
   modifiedDate: string;
}

export const getPersonDefaultInstance = ():PersonQL => ({
   personId: 0,
   firstName: '',
   lastName: '',
   documentType: '',
   documentId: '',
   address: null,
   contactInfo: []
});

export const getEmployeeJobDefaultInstance = ():IEmployeeJobQL => ({
   employeeJobId: 0,
   tittle: '',
   description: '',
   createdDate: '',
   modifiedDate: ''
});


export const FETCH_EMPLOYEES = gql`
   query fetchEmployees($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]){
      employees {
         page(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            totalCount
            content {
               employeeId
               firstName
               lastName
               documentId
               documentType
            }
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

// export const FETCH_EMPLOYEE_JOBS = gql`
//    query fetchEmployeeJobs{
//       employeeJobs {
//          employeeJobId
//          tittle
//       }
//    }
// `;
