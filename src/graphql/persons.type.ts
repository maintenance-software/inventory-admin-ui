
export interface IPersons {
   person: IPerson;
   list: IPerson[];
}

export interface IPerson {
   personId: number;
   firstName: string;
   lastName: string;
   documentType: string;
   documentId: string;
   address: Address | null;
   contactInfo: ContactInfo[];
}

export interface Address {
   addressId: number;
   street1: string;
   street2: string;
   street3: string;
   zip: string;
   city: string;
   state: string;
   country: string;
}

export interface ContactInfo {
   contactId: number;
   contact: string;
   contactType: string;
}

export enum ContactType{
   EMAIL = 'EMAIL',
   WORK_PHONE = 'WORK_PHONE',
   CELL_PHONE = 'CELL_PHONE',
   WHATSAPP = 'WHATSAPP'
}
