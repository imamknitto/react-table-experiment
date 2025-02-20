const BASE_URL = 'http://192.168.20.27:8211';

export interface IResponse<IData> {
  message: string;
  result: {
    data: IData;
    pagination: {
      currentPage: number;
      totalPage: number;
      totalData: number;
      perPage: number;
      search: Array<string | number>;
    };
  };
}

export interface IStreamApi {
  _id: string;
  tanggal: string;
  pathUrl: string;
  request: string;
  response: string;
  status: string;
  level: string;
  tipe: string;
  ingest_date: string;
  response_time: string;
  request_id: string;
}

export const getDataStreamApi = async <T>(params: Record<string, string | number> = {}): Promise<T | null> => {
  const url = new URL(`${BASE_URL}/monitor/meili/api/knitto-api`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key].toString()));
  const headers = {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2IwMDk3YTUzMTVmNzg5ODI2MGMzZjMiLCJuYW1lIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6eyJfaWQiOiI2NzY1MWVhNGVkODU2YTI0YzlhOTIxOTYiLCJpZCI6InVzZXIiLCJuYW1lIjoiUGVuZ2d1bmEiLCJkZXNjcmlwdGlvbnMiOiJQZW5nZ3VuYSBSZWd1bGVyIGFkYWxhaCBwZW5nZ3VuYSBkZW5nYW4gYWtzZXMgdGVyYmF0YXMgdW50dWsgbWVuZ2d1bmFrYW4gZml0dXIgZGFzYXIgZGFsYW0gc2lzdGVtLiIsImNyZWF0ZWRfYXQiOiIyMDI0LTEyLTE2VDEwOjAwOjAwLjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyNC0xMi0xNlQxMDowMDowMC4wMDBaIn0sImNyZWF0ZWRfYXQiOiIyMDI1LTAyLTE1VDAzOjI2OjUwLjEwMFoiLCJpYXQiOjE3NDAwMjMzOTIsImV4cCI6MTc0MDYyODE5Mn0.UWCDfF3azTvcH9yQl7jS7RgPJcZxOoYZpmiamT7YFmU',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};
