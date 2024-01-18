export declare function getDoc(originalText: string, uri: string): string[];
export declare function getDocTrim(originalText: string, uri: string): string[];
export declare function getInterfaces(originalText: string, name: string, jsDoc: string[], type?: 'js' | 'ts'): string | void;
export declare function getObject(code: string, name: string, replace: boolean, type: 'js' | 'ts'): string | void;
