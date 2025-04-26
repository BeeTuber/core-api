import { vault as vaultConfig } from "../config";
import { CustomError } from "../types";

const VAULT_VERSION = "v2";

type VaultKVResponse = {
  data: {
    data: Record<string, any>;
    metadata: Record<string, any>;
  };
};

/**
 * Get a secret value form Vault
 */
export const getSecret = async <Response = Record<string, any>>(
  organizationId: string,
  path: string
): Promise<Response> => {
  if (path.startsWith("/")) path = path.substring(1);
  const url = `${vaultConfig.address}/${VAULT_VERSION}/${vaultConfig.mount}/data/${organizationId}/${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-Vault-Token": "",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Vault read error: ${res.status} ${error}`);
  }

  const json: VaultKVResponse = (await res.json()) as VaultKVResponse;
  return json.data.data as Response;
};

/**
 * Set a secret value in Vault
 */
export const setSecret = async (
  organizationId: string,
  path: string,
  data: Record<string, any>
): Promise<void> => {
  if (path.startsWith("/")) path = path.substring(1);
  const url = `${vaultConfig.address}/${VAULT_VERSION}/${vaultConfig.mount}/data/${organizationId}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Vault-Token": "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Vault write error: ${res.status} ${error}`);
  }
};
