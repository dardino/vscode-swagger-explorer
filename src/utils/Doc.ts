import { OpenAPIV3 } from "openapi-types";

export function extractTagsFromOperations(doc: OpenAPIV3.Document): string[] {
	const items = Object.keys(doc.paths).map(k => doc.paths[k]);
	const ops = items.reduce(
		(a, p) =>
			a.concat(
				Object.keys(p)
					.filter(k => !["$ref", "parameters", "summary", "description", "servers"].includes(k))
					.map(k => (p as any)[k])
			),
		[] as any[]
	) as OpenAPIV3.OperationObject[];

	const tagsstr = ops.reduce((a, o: OpenAPIV3.OperationObject) => a.concat(o.tags || []), [] as string[]);
	return tagsstr;
}
export interface KeyValuePair<V> {
	key: string;
	value: V;
}

export function toKeyValuePair<T extends KeyValuePair<any>>(object: any): Array<T> {
	if (object == null) {
		return [];
	}
	return Object.keys(object).map<KeyValuePair<any>>(p => ({ key: p, value: object[p] })) as T[];
}

export function getReference<T>(obj: { $ref?: string }, $root: OpenAPIV3.Document): T {
	if (obj == null) {
		return {} as T;
	}
	if (typeof obj.$ref !== "string") {
		return obj as T;
	}
	const ref = obj.$ref.split("/");
	let tmp: any = $root;
	for (const prop of ref) {
		if (prop === "#") {
			continue;
		}
		tmp = tmp[prop];
	}
	return tmp as T;
}
