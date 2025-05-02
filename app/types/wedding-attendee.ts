export interface WeddingAttendeeRO {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  attending: boolean;
  interested_in_shuttle: boolean;
  interested_in_hotel_block: boolean;
  has_plus_one: boolean;
}

export type WeddingAttendee = {
  first_name: string;
  last_name: string;
  attending: boolean;
  interested_in_shuttle: boolean;
  interested_in_hotel_block: boolean;
  has_plus_one?: boolean;
};
