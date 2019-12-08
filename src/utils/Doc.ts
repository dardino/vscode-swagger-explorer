import { OpenAPIV2, OpenAPIV3 } from "openapi-types";

export function extractTagsFromOperations(doc: OpenAPIV2.Document | OpenAPIV3.Document): string[] {
	const items = Object.keys(doc.paths).map((k: string) => doc.paths[k] as OpenAPIV2.PathItemObject | OpenAPIV3.PathItemObject);
	const ops = items.reduce(
		(a, p) =>
			a.concat(
				Object.keys(p)
					.filter(k => !["$ref", "parameters", "summary", "description", "servers"].includes(k))
					.map(k => (p as any)[k])
			),
		[] as any[]
	) as OpenAPIV2.OperationObject[];

	const tagsstr = ops.reduce(
		(a, o: OpenAPIV2.OperationObject | OpenAPIV3.OperationObject) => a.concat(o.tags || []),
		[] as string[]
	);
	return tagsstr;
}
