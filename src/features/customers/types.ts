export interface Customer {
  id?: string;
  fullname: string;
  email: string;
  address: string;
}

export interface CreateCustomerDialogProps {
  open: boolean;
  onClose: () => void;
}
