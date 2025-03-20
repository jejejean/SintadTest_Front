export const REQUEST_MAPPING = 'api/v1';
export const ENTITY_API_ENDPOINTS = `${REQUEST_MAPPING}/entity`;
export const DOCUMENT_TYPE_API_ENDPOINTS = `${REQUEST_MAPPING}/document-type`;
export const TAXPAYER_API_ENDPOINTS = `${REQUEST_MAPPING}/taxpayer-type`;

export const USER_API_ENDPOINTS = {
  GET_BY_ID: REQUEST_MAPPING + '/users',
};

export const BUSINESS_API_ENDPOINTS = {
  GET_BY_ID: REQUEST_MAPPING + '/business',
};

export const LOGIN_API_ENDPOINTS = {
  REQUEST_MAPPING: 'auth',
  LOGIN: 'login',
};

export const DOCUMENT_TYPE ={
  GET_ALL: `${DOCUMENT_TYPE_API_ENDPOINTS}/all-document-types`,
  GET_BY_ID: DOCUMENT_TYPE_API_ENDPOINTS,
  CREATE: `${DOCUMENT_TYPE_API_ENDPOINTS}/new-document-type`,
  UPDATE: `${DOCUMENT_TYPE_API_ENDPOINTS}/update-document-type`,
  DELETE: `${DOCUMENT_TYPE_API_ENDPOINTS}/delete-document-type`,
  GET_ALL_BY_STATE: `${DOCUMENT_TYPE_API_ENDPOINTS}/all-document-by-state`,
}

export const TAXPAYER_TYPE = {
  GET_ALL: `${TAXPAYER_API_ENDPOINTS}/all-taxpayer-types`,
  GET_BY_ID: TAXPAYER_API_ENDPOINTS,
  CREATE: `${TAXPAYER_API_ENDPOINTS}/new-taxpayer-type`,
  UPDATE: `${TAXPAYER_API_ENDPOINTS}/update-taxpayer-type`,
  DELETE: `${TAXPAYER_API_ENDPOINTS}/delete-taxpayer-type`,
  GET_ALL_BY_STATE: `${TAXPAYER_API_ENDPOINTS}/all-taxpayer-by-state`,
}

export const ENTITY = {
  GET_ALL: `${ENTITY_API_ENDPOINTS}/all-entities`,
  GET_BY_ID: ENTITY_API_ENDPOINTS,
  CREATE: `${ENTITY_API_ENDPOINTS}/new-entity`,
  UPDATE: `${ENTITY_API_ENDPOINTS}/update-entity`,
  DELETE: `${ENTITY_API_ENDPOINTS}/delete-entity`,
}