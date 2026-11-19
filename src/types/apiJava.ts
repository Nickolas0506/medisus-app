// Formato EXATO devolvido pela API Java do grupo (https://medisus.onrender.com/swagger-ui).
// Os services convertem estes DTOs para os modelos em portugues usados pelas telas (types/api.ts).

export type RoleJava = 'CITIZEN' | 'PHARMACIST' | 'MANAGER';

export type TokenResponse = {
  token: string;
  tokenType: string;
  expiresIn: number;
  role: RoleJava;
  name: string;
};

export type UserResponse = { id: number; name: string; email: string; role: RoleJava };

export type UbsResponse = {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type MedicationResponse = {
  id: number;
  name: string;
  activeIngredient?: string | null;
  description?: string | null;
};

export type StockResponse = {
  id: number;
  ubsId: number;
  ubsName: string;
  medicationId: number;
  medicationName: string;
  quantity: number;
  updatedAt: string;
  farmaciaPopularEligibility?: string | null;
};

export type AlertResponse = {
  id: number;
  medicationId: number;
  medicationName: string;
  ubsId?: number | null;
  active: boolean;
  createdAt: string;
};

export type NotificationResponse = {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
};

export type PrescriptionCandidates = {
  candidates: string[];
  instruction?: string | null;
};
