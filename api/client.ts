export function requireApiConfig() {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  const testUserUuid = process.env.EXPO_PUBLIC_TEST_USER_UUID;

  if (!apiBaseUrl || !testUserUuid) {
    throw new Error('Отсутствуют env переменные EXPO_PUBLIC_API_BASE_URL или EXPO_PUBLIC_TEST_USER_UUID');
  }

  return { apiBaseUrl, testUserUuid };
}

export function getAuthHeaders() {
  const { testUserUuid } = requireApiConfig();

  return {
    Authorization: `Bearer ${testUserUuid}`,
    'Content-Type': 'application/json',
  };
}

export function getApiBaseUrl() {
  return requireApiConfig().apiBaseUrl;
}
