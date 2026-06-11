export interface CartSeller {
  id: string;
  business_name: string;
}

export interface CartProduct {
  id: string;
  title: string;
  is_available: boolean;
}

export interface CartOption {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
}

export interface CartApiItem {
  id: string;
  product: CartProduct;
  option: CartOption;
  quantity: number;
  subtotal: number;
  added_at: string;
}

export interface CartApiGroup {
  seller: CartSeller;
  items: CartApiItem[];
  subtotal: number;
}

export interface CartApiData {
  groups: CartApiGroup[];
  total_count: number;
  total_amount: number;
}

export interface CartItemUI extends CartApiItem {
  checked: boolean;
}

export interface CartGroupUI extends Omit<CartApiGroup, 'items'> {
  items: CartItemUI[];
}
