import { CompletionItem, DiagnosticSeverity, Hover, Position, Range } from "vscode-languageserver";

// This file contains all interfaces and types exposed for
// use within an Antlers language server extension.

export interface Version {
	/**
	 * Tests if a version is within the provided range.
	 * 
	 * @param {string} version The version to check.
	 * @param {string} range The accepted version ranges.
	 * @returns 
	 */
	satisfies(version: string, range: string): boolean,
	/**
		 * Tests if a version string is greater or equal to another.
		 * 
		 * @param {string} version The version to test.
		 * @param {string} compareTo The version to test against.
		 * @returns 
		 */
	gte(version: string, compareTo: string): boolean,
	/**
	 * Tests if a version string is less than or equal to another.
	 * 
	 * @param {string} version The version to test.
	 * @param {string} compareTo The version to test against.
	 * @returns 
	 */
	lte(version: string, compareTo: string): boolean,
	/**
	* Tests if a version string is greater than another.
	* 
	* @param {string} version The version to test.
	* @param {string} compareTo The version to test against.
	* @returns 
	*/
	lt(version: string, compareTo: string): boolean,
	/**
	 * Tests if a version string is less than another.
	 * 
	 * @param {string} version The version to test.
	 * @param {string} compareTo The version to test against.
	 * @returns 
	 */
	gt(version: string, compareTo: string): boolean
}

export interface SuggestionHandler {
	(params: ISuggestionRequest): CompletionItem[]
}

export interface ParameterSuggestionHandler {
	(parameter: IAntlersParameter, params: ISuggestionRequest): CompletionItem[]
}

export interface TagSuggestionHandler {
	(tag: IAntlersTag, params: ISuggestionRequest): CompletionItem[]
}

export interface GeneralHoverHandler {
	(params: ISuggestionRequest): Hover | null
}

export interface ModifierHoverHandler {
	(modifier: IModifier, params: ISuggestionRequest): Hover | null
}

export interface TagHoverHandler {
	(tag: IAntlersTag, params: ISuggestionRequest): Hover | null
}

export interface ParameterHoverHandler {
	(parameter: IAntlersParameter, params: ISuggestionRequest): Hover | null
}

export interface ScopeVariableHoverHandler {
	(variable: IScopeVariable, params: ISuggestionRequest): Hover | null
}

export function getParameterRange(params:ISuggestionRequest) : Range | null {
	if (params.symbolsInScope.length > 0) {
		const lastSymbolInScope = params.symbolsInScope[params.symbolsInScope.length - 1];

		return {
			start: {
				character: lastSymbolInScope.startOffset,
				line: lastSymbolInScope.startLine
			},
			end: {
				character: lastSymbolInScope.endOffset,
				line: lastSymbolInScope.endLine
			}
		};
	}

	return null;
}

export interface AntlersExtensionContext {
	/**
	 * Provides access to version comparison utilities.
	 */
	version: Version,

	onGeneralHover(handler: GeneralHoverHandler | null): void;
	onModifierHover(handler: ModifierHoverHandler | null): void;
	onParameterHover(handler: ParameterHoverHandler | null): void;
	onScopeVariableHover(handler: ScopeVariableHoverHandler | null): void;
	onGeneralCompletionRequest(handler: SuggestionHandler | null): void;
	onModifierCompletionRequest(handler: SuggestionHandler | null): void;
	onParameterCompletionRequest(handler: ParameterSuggestionHandler | null): void;
	onTagCompletionRequest(handler: TagSuggestionHandler | null): void;

	/**
	 * Attempts to retrieve Composer package details for the provided addon.
	 * 
	 * @param {string} addonName The name of the addon.
	 * @returns
	 */
	getStatamicAddon(addonName: string): IComposerPackage | null
	/**
		 * Returns the currently installed Statamic version.
		 * 
		 * @returns 
		 */
	getStatamicVersion(): string,
	/**
		* Tests if a Composer package with the given name is available.
		* 
		* @param {string} packageName  The package name.
		* @returns 
		*/
	hasComposerPackage(packageName: string): boolean
	/**
		 * Attempts to retrieve Composer package details for the provided package name.
		 * 
		 * @param {string} packageName The package name.
		 * @returns 
		 */
	getComposerPackage(packageName: string): IComposerPackage | null,
	/**
		* Tests if a Statamic addon is available.
		* 
		* @param {string} addonName  The addon name.
		* @returns 
		*/
	hasStatamicAddon(addonName: string): boolean,
	/**
	   * Retreives all partials defined by the developer.
	   * 
	   * @returns 
	   */
	getPartials(): IView[],
	/**
	 * Attempts to locate view information for the provided document URI.
	 * 
	 * @param {string} documentUri  The document URI.
	 * @returns 
	 */
	findView(documentUri: string): IView | null,
	/**
	* Attempts to locate view information for the provided partial name.
	* 
	* @param {string} name The partial name.
	* @returns 
	*/
	findPartial(name: string): IView | null,
	/**
	 * Locates blueprint field information for the given blueprint handle.
	 * 
	 * @param {string} handle The blueprint handle.
	 * @returns 
	 */
	getBlueprintFields(handle: string): IBlueprintField[],
	/**
	* Returns all known public asset paths.
	* 
	* @returns 
	*/
	getPublicAssetPaths(): string[],
	/**
	 * 
	 * Returns all known Glide presets.
	 * 
	 * @returns
	 */
	getGlidePresets(): string[],
	/**
	 * Returns all known terms for a given taxonomy.
	 * 
	 * @param {string} name  The taxonomy name.
	 * @returns 
	 */
	getTaxonomyTerms(name: string): string[],
	/**
	* Tests if a taxonomy with the given name exists.
	* 
	* @param {string} name  The taxonomy name.
	* @returns 
	*/
	hasTaxonomy(name: string): boolean,
	/**
	 * Returns all blueprint fields for the provided collections.
	 * 
	 * @param {string[]} collections The collection handles.
	 * @returns 
	 */
	getCollectionBlueprintFields(collections: string[]): IBlueprintField[],
	/**
	* Retrieves information on a single blueprint field.
	* 
	* @param {string} blueprintName The blueprint or collection name.
	* @param {string} fieldHandle The field handle.
	* @returns 
	*/
	getBlueprintField(blueprintName: string, fieldHandle: string): IBlueprintField | null,
	/**
	 * Retrieves blueprint fields for the provided taxonomy names.
	 * 
	 * @param {string[]} taxonomyNames The taxonomies.
	 * @returns 
	 */
	getTaxonomyBlueprintFields(taxonomyNames: string[]): IBlueprintField[],
	/**
	* Retrieves bluieprint fields for the default "users" blueprint.
	* @returns 
	*/
	getUserFields(): IBlueprintField[],
	/**
	 * Retrieves blueprint fields for the provided form.
	 * 
	 * @param {string} handle The form handle.
	 * @returns 
	 */
	getFormBlueprintFields(handle: string): IBlueprintField[],
	/**
	* Retrieves blueprint fields for the provided asset container.
	* 
	* @param {string} handle The asset handle.
	* @returns 
	*/
	getAssetBlueprintFields(handle: string): IBlueprintField[],
	/**
	 * Retreives a list of all unique taxonomy names.
	 * 
	 * @returns 
	 */
	getTaxonomyNames(): string[],
	/**
	* Retrieves a list of all unique collection names.
	* 
	* @returns 
	*/
	getCollectionNames(): string[],
	/**
	 * Retrieves a list of all unique partial names.
	 * 
	 * @returns
	 */
	getPartialNames(): string[],
	/**
	* Retrieves a list of all unique user group names.
	* 
	* @returns 
	*/
	getUserGroupNames(): string[],
	/**
	 * Retrieves a list of all unique form handles.
	 * 
	 * @returns 
	 */
	getFormNames(): string[],
	/**
	* Retrieves a list of all unique global setting containers.
	* 
	* @returns 
	*/
	getGlobalsNames(): string[],
	/**
	 * Retrieves a list of all configured navigation structures/menus.
	 * 
	 * @returns 
	 */
	getNavigationNames(): string[],
	/**
	* Retrieves a list of all unique asset names.
	* 
	* @returns 
	*/
	getAssetNames(): string[],
	/**
	 * Retrieves a list of all unique route names.
	 * 
	 * @returns 
	 */
	getRouteNames(): string[],
	/**
	* Retrieves a list of all unique translation keys.
	* 
	* @returns 
	*/
	getTranslationKeys(): string[],
	/**
	 * Registers a new diagnostics handler to test for and report errors.
	 * 
	 * @param {IDiagnosticsHandler} handler The diagnostics handler.
	 */
	registerDiagnosticsHandler(handler: IDiagnosticsHandler): void,
	/**
	* Registers a new Antlers tag with the core engine.
	* 
	* @param {IAntlersTag} tag The tag instance.
	*/
	registerTag(tag: IAntlersTag): void,
	/**
	 * Registers a collection of Antlers tags with the core engine.
	 * 
	 * @param {IAntlersTag[]} tags The tags to register.
	 */
	registerTags(tags: IAntlersTag[]): void,
	/**
	* Registers a basic Antlers tag, with the provided parameters.
	* 
	* @param {string} tagName The new tag name.
	* @param {IAntlersParameter[]} parameters The parameters, if any.
	*/
	providesTag(tagName: string, parameters: IAntlersParameter[]): void,
	/**
	 * Registers a new modifier with the core engine.
	 * 
	 * @param {IModifier} modifier The modifier.
	 */
	registerModifier(modifier: IModifier): void,
	/**
	* Registers a collection of modifiers with the core engine.
	* 
	* @param {IModifier[]} modifiers The modifiers.
	*/
	registerModifiers(modifiers: IModifier[]): void,
	/**
	 * Registers a simple modifier with the core engine.
	 * 
	 * @param {string} modifierName The modifier name.
	 * @param {string[]} expectsTypes The expected types, if any.
	 * @param {string[]} returnsTypes The return types, if any.
	 */
	providesModifier(modifierName: string, expectsTypes: string[], returnsTypes: string[]): void
}

export interface IView {
	/**
	 * The normalized path to the template file.
	 */
	path: string,
	/**
	 * The relative file name on disk.
	 */
	relativeFileName: string,
	/**
	 * A display name constructed from the relative file path and file name.
	 */
	relativeDisplayName: string,
	/**
	 * A collection of view data variables.
	 *
	 * @see https://statamic.dev/template-engines#view-data
	 */
	viewDataVariables: string[],
	/**
	 * The normalizerd relative path to the file.
	 */
	relativePath: string,
	/**
	 * A list of collections (or blueprints) the template file injects into the scope context.
	 */
	injectsCollections: string[],
	/**
	 * The file name (including extension) of the template.
	 */
	fileName: string,
	/**
	 * The adjusted document URI of the template.
	 */
	documentUri: string,
	/**
	 * The original document URI presented to the internal systems.
	 */
	originalDocumentUri: string,
	/**
	 * A friendly display name for the template.
	 */
	displayName: string,
	/**
	 * Indicates if the template is an Antlers partial.
	 */
	isPartial: boolean,
	/**
	 * Indicates if the template is an Antlers file.
	 */
	isAntlers: boolean,
	/**
	 * Indicates if the template is a Blade file.
	 */
	isBlade: boolean
}

export interface IComposerPackage {
	/**
	 * The name of the Composer package.
	 */
	name: string,
	/**
	 * The installed version of the Composer package (from composer.lock).
	 */
	version: string,
	/**
	 * The path on disk to the composer.json (accounts for path repository types).
	 */
	vendorPath: string,
	/**
	 * Indicates if the Composer package is a Statamic addon.
	 */
	isStatamicAddon: boolean
}

export interface Scope {
	/**
	 * Creates a new Scope instance.
	 */
	makeNew(): Scope,
	/**
	 * Returns access to the parent scope.
	 * 
	 * For root scopes, this may return a self-reference.
	 */
	ancestor(): Scope,
	/**
	 * Tests if a path exists in the current scope.
	 * 
	 * @param {string} path The path to test.
	 */
	containsPath(path: string): boolean,
	findReference(path: string): IScopeVariable | null,
	containsReference(path: string): boolean,
	findNestedScope(path: string): Scope | null,
	liftList(name: string): Scope | null,
	hasListInHistory(name: string): boolean,
	hasList(name: string): boolean,
	bringListIntoMainScope(path: string): Scope,
	getListNames(): string[],
	hasValue(name: string): boolean,
	findReferenceNotIntroducedBy(name: string, introducedBy: ISymbol): IScopeVariable | null,
	removeThroughIntroduction(name: string, introducedBy: ISymbol): void,
	wasIntroducedBySymbol(name: string, checkSymbol: ISymbol): boolean,
	referencesArray(name: string): boolean,
	addScopeList(listName: string, scope: Scope): Scope
	mergeAndList(listName: string, data: IScopeVariable[]): Scope,
	mergeScope(scope: Scope): Scope,
	mergeVariableScope(data: IScopeVariable[]): Scope,
	addVariable(variable: IScopeVariable): void,
	addVariables(variables: IScopeVariable[]): void,
	addVariableArray(name: string, variables: IScopeVariable[]): void,
	injectAssetContainer(symbol: ISymbol, container: string): void,
	injectUserFields(symbol: ISymbol): void,
	addBlueprintField(symbol: ISymbol, field: IBlueprintField): void,
	introduceScopedAliasScope(symbol: ISymbol, scopeName: string, aliasName: string, fields: IBlueprintField[]): Scope,
	expandScopedAliasScope(symbol: ISymbol, scopeName: string, aliasName: string, fields: IBlueprintField[]): void,
	introduceAliasScope(symbol: ISymbol, aliasName: string, fields: IBlueprintField[]): void,
	introduceDynamicScopeList(symbol: ISymbol, listName: string, fields: IBlueprintField[]): void,
	addBlueprintFields(symbol: ISymbol, fields: IBlueprintField[]): void,
	injectBlueprint(symbol: ISymbol, handle: string): void,
	copy(): Scope
}

export interface ICompletionResult {
	/**
	 * A list of completion items to use, or merge in.
	 */
	items: CompletionItem[],
	/**
	 * Indicates if the items should be used exclusively.
	 */
	isExclusiveResult: boolean
}

/**
 * Returns a new IReportableError from the provided symbol information.
 * 
 * @param {string} message The diagnostics message.
 * @param {DiagnosticSeverity} severity The diagnostic severity.
 * @param {ISymbol} symbol The symbol to convert.
 * @returns 
 */
export function symbolToReportableError(message: string, severity:DiagnosticSeverity, symbol: ISymbol): IReportableError {
	return {
		endLine: symbol.startLine,
		endPos: symbol.endOffset,
		message: message,
		severity: severity,
		startLine: symbol.startLine,
		startPos: symbol.startOffset
	};
}

export interface ISuggestionRequest {
	/**
	 * The adjusted document URI.
	 */
	document: string,
	/**
	 * Indicates if the user's caret is within an Antlers tag.
	 */
	isCaretInTag: boolean,
	/**
	 * The character to the left of the user's caret.
	 */
	leftChar: string,
	/**
	 * The word to the left of the user's caret.
	 * 
	 * Calculated by consuming all characters until whitespace is encountered.
	 * This word is adjusted by trimming important Antlers characters from the left and right.
	 */
	leftWord: string,
	/**
	 * The word to the left of the user's caret.
	 * 
	 * Calculated by consuming all characters until whitespace, or the ':' character is encountered.
	 */
	leftMeaningfulWord: string | null,
	/**
	 * Same as leftWord, but no adjustments are made.
	 */
	originalLeftWord: string,
	/**
	 * The character to the right of the user's caret.
	 */
	rightChar: string,
	/**
	 * The word to the right of the user's caret.
	 * 
	 * Calculated by consuming all characters until whitespace is encountered.
	 */
	rightWord: string,
	/**
	 * The active parameter the caret is inside of, if any.
	 */
	activeParameter: IParameterAttribute | null,
	/**
	 * The active variable interpolation range the caret is inside of, if any.
	 */
	activeInterpolation: IVariableInterpolation | null,
	/**
	 * The position of the user's caret.
	 */
	position: Position,
	/**
	 * The active symbol the caret is inside of, if any.
	 */
	currentSymbol: ISymbol | null,
	/**
	 * A list of all symbols within the scope of the current position.
	 * 
	 * This list only considers symbols that have appeared before the caret position.
	 */
	symbolsInScope: ISymbol[],
	/**
	 * Indicates if the user's caret is within Antlers braces ('{{' and '}}').
	 */
	isInDoubleBraces: boolean,
	/**
	 * Indicates if the user's caret is within a variable interpolation range.
	 */
	isInVariableInterpolation: boolean,
	/**
	 * The offset the variable interpolation range starts on, if applicable.
	 */
	interpolationStartsOn: number | null
}

export interface IAntlersTag {
	/**
	 * The name of the tag. Tag names including the ':' character are acceptable.
	 */
	tagName: string,
	/**
	 * Indicates if the tag must be closed.
	 */
	requiresClose: boolean,
	/**
	 * If requiresClose is false, this can be used to indicate that the tag
	 * can be used like a variable, but it also acceptable to use a
	 * closing tag if the tag supports arbitrary user content.
	 */
	allowsContentClose: boolean,
	/**
	 * Indicates if the tag allows arbitrary user parameters.
	 * 
	 * Typically used if the tag performs filtering based on dynamic parameters,
	 * or to allow the template developer to pass-thru CSS styles and classes.
	 */
	allowsArbitraryParameters: boolean,
	/**
	 * When true, the scope engine will supply the tag instance with the
	 * previous scope's variables, lists, and any nested scopes.
	 */
	injectParentScope: boolean,
	/**
	 * A list of acceptable Antlers tag parmaeters.
	 */
	parameters: IAntlersParameter[],
	/**
	 * Indicates if this tag should be included in the completions result.
	 * 
	 * Typically used to hide an alias from the completions list, but allow
	 * the internal engines to provide analysis and language features
	 * when they are encountered. Examples are the 'member:' tags.
	 */
	hideFromCompletions: boolean,
	/**
	 * Allows the tag implementor to inject data into the active scope.
	 * 
	 * Implementations must always return the modified scope to use.
	 * 
	 * @param {ISymbol} symbol The active symbol adjusting scope.
	 * @param {Scope} scope The active scope.
	 */
	augmentScope?(symbol: ISymbol, scope: Scope): Scope,
	/**
	 * Provides an opportunity for tag authors to suggest alternative parameter names.
	 * 
	 * Useful for commonly confused tags, or common typos.
	 * 
	 * @param {string} unknown The name of the unknown parameter.
	 */
	suggestAlternativeParams?(unknown: string): string[],
	/**
	 * Provides an opportunity for tag authors to inspect the current 
	 * scope, as well as details about how the user is writing the
	 * template code, to determine if the tag should be closed.
	 * 
	 * @param {ISymbol} symbol The symbol being analyzed with respect to the tag.
	 */
	requiresCloseResolver?(symbol: ISymbol): boolean,
	/**
	 * Provides an opportunity to return a dynamic parameter instance
	 * to the internal engines when an unknown parameter is found.
	 * 
	 * @param {ISymbol} symbol The active symbol being analyzed.
	 * @param {string} paramName The encountered parameter name.
	 */
	resolveDynamicParameter?(symbol: ISymbol, paramName: string): IAntlersParameter | null,
	/**
	 * Allows tag authors to control what items are presented to the user when
	 * a completion request is triggered within an Antlers parameter.
	 * 
	 * @param {IAntlersParameter} parameter The active Antlers parameter.
	 * @param {ISuggestionRequest} params The original suggestion request.
	 */
	resovleParameterCompletionItems?(parameter: IAntlersParameter, params: ISuggestionRequest): ICompletionResult | null,
	/**
	 * Allows tag authors to contribute to the completions list within the current tag context.
	 * 
	 * @param {ISuggestionRequest} params The original suggestion request.
	 */
	resolveCompletionItems?(params: ISuggestionRequest): ICompletionResult
}

export interface IAntlersParameter {
	/**
	 * The name of the parameter.
	 */
	name: string,
	/**
	 * Indicates if the parameter is required to use the tag.
	 */
	isRequired: boolean,
	/**
	 * A user-friendly description of the parameter.
	 */
	description: string,
	/**
	 * Indicates whether the parameter was dynamically created, or not.
	 */
	isDynamic: boolean,
	/**
	 * A list of optional aliases for the parameter.
	 */
	aliases: string[] | null,
	/**
	 * Indicates if the parameter accepts variable interpolation.
	 * 
	 * Example: some="{value}"
	 */
	acceptsVariableInterpolation: boolean,
	/**
	 * Indicates if the parameter accepts variable references.
	 * 
	 * Example: :some="value"
	 */
	allowsVariableReference: boolean,
	/**
	 * A list of expected types for the parameter.
	 * 
	 * Allowed values are:
	 *   *       - Any
	 *   string  - string
	 *   date    - date
	 *   number  - numeric
	 *   array   - array
	 *   boolean - boolean
	 */
	expectsTypes: string[],
	/**
	 * Provides an opportunity to report any errors with the parameter's contents.
	 * 
	 * @param {ISymbol} symbol The symbol being analyzed.
	 * @param {IParameterAttribute} parameter The parameter being analyzed.
	 */
	validate?(symbol: ISymbol, parameter: IParameterAttribute): IReportableError[]
}

export interface IModifier {
	/**
	 * The name of the modifier.
	 */
	name: string,
	/**
	 * A list of expected types for the modifier.
	 * 
	 * Allowed values are:
	 *   *       - Any
	 *   string  - string
	 *   date    - date
	 *   number  - numeric
	 *   array   - array
	 *   boolean - boolean
	 */
	acceptsType: string[],
	/**
	 * A list of return types for the modifier.
	 * 
	 * Allowed values are:
	 *   *       - Any
	 *   string  - string
	 *   date    - date
	 *   number  - numeric
	 *   array   - array
	 *   boolean - boolean
	 */
	returnsType: string[],
	/**
	 * A user-friendly description of the modifier.
	 */
	description: string,
	/**
	 * A list of acceptable modifier parameters.
	 */
	parameters: IModifierParameter[],
	/**
	 * An optional web URI that will be displayed as part of the modifier suggestion.
	 */
	docLink: string | null,
	/**
	 * Indicates if the modifier can appear as a parameter suggestion for applicable variables.
	 */
	canBeParameter: boolean
}

export interface IModifierParameter {
	/**
	 * The name of the modifier parameter.
	 */
	name: string,
	/**
	 * A user-friendly description of the modifier parameter.
	 */
	description: string
}

export interface IErrorLocation {
	/**
	 * The start line of the error.
	 */
	startLine: number,
	/**
	 * The end line of the error.
	 */
	endLine: number,
	/**
	 * The start offset of the error (relative to the start line).
	 */
	startPos: number,
	/**
	 * The end offset of the error (relative to the end line).
	 */
	endPos: number,
	/**
	 * The severity of the error.
	 */
	severity: DiagnosticSeverity
}

export interface IReportableError extends IErrorLocation {
	/**
	 * The message to display to the end-user.
	 */
	message: string
}

export interface IDiagnosticsHandler {
	/**
	 * Checks a symbol for any issues.
	 * 
	 * @param {ISymbol} symbol The symbol being analyzed.
	 */
	checkSymbol(symbol: ISymbol): IReportableError[]
}

export interface IFieldsetField {
	/**
	 * The fieldsets handle.
	 */
	handle: string,
	/**
	 * The name of the field.
	 */
	name: string,
	/**
	 * Optional instruction text that is displayed to the end-user.
	 * 
	 * This typically is displayed to authors in the Statamic Control Panel.
	 * This information may also be displayed in completion suggestions.
	 */
	instructionText: string | null,
	/**
	 * The fieldset type.
	 */
	type: string
}


export interface IBlueprintField {
	/**
	 * The name of the blueprint or collection introducing the field.
	 */
	blueprintName: string,
	/**
	 * The name of the field.
	 */
	name: string,
	/**
	 * A user-friendly name for the field, if any.
	 */
	displayName: string | null,
	/**
	 * Optional instruction text that is displayed to the end-user.
	 * 
	 * This typically is displayed to authors in the Statamic Control Panel.
	 * This information may also be displayed in completion suggestions.
	 */
	instructionText: string | null,
	/**
	 * The maximum number of allowable items for list-type fields.
	 */
	maxItems: number | null,
	/**
	 * The field type.
	 */
	type: string,
	/**
	 * A reference to the known fieldset instance, if available.
	 */
	refFieldSetField: IFieldsetField | null,
	/**
	 * A list of sets contained within the field.
	 * 
	 * Common examples are the Replicator and Bard fieldtypes.
	 */
	sets: ISet[] | null
}

export interface ISet {
	/**
	 * The set's handle.
	 */
	handle: string,
	/**
	 * A user-friendly name for the set of fields.
	 */
	displayName: string,
	/**
	 * The fields contained within the set.
	 */
	fields: IBlueprintField[]
}

export interface IRuntimeVariableType {
	/**
	 * An inferred value type.
	 */
	assumedType: string,
	/**
	 * Indicates if the represented variable references a collection.
	 */
	doesReferenceCollection: boolean,
	/**
	 * A list of all referenced blueprint fields.
	 */
	referencedFields: IBlueprintField[],
	/**
	 * The primary reference field, if available.
	 */
	referenceField: IBlueprintField | null,
	/**
	 * A list of a supplemental fields, if applicable.
	 */
	supplementedFields: IBlueprintField[] | null,
	/**
	 * A list of all known referenced collection names.
	 */
	collectionReferences: string[],
	/**
	 * Indicates if the represented variable references blueprints.
	 */
	referencesBlueprints: boolean
}

export interface IScopeVariable {
	/**
	 * The name of the variable.
	 */
	name: string,
	/**
	 * The inferred runtime data type of the variable reference.
	 */
	dataType: string,
	/**
	 * The blueprint field underlying the variable, if any.
	 */
	sourceField: IBlueprintField | null,
	/**
	 * Provides a reference to where/how the variable was introduced.
	 * 
	 * Internal providers will be prefixed with '*internal'.
	 */
	sourceName: string,
	/**
	 * The symbol that introduced the variable.
	 * 
	 * An example would be the collection tag introducing a 'posts' array.
	 */
	introducedBy: ISymbol | null
}

export interface IModifierArgument {
	/**
	 * The content of the modifier argument.
	 */
	content: string,
	/**
	 * The order in which the modifier appears in the call stack.
	 */
	order: number,
	/**
	 * The start offset of the modifier.
	 */
	startOffset: number,
	/**
	 * The end offset of the modifier,
	 */
	endOffset: number,
	/**
	 * The line the modifier appears on.
	 */
	line: number,
	/**
	 * The attached scope variable, if any.
	 */
	scopeVariable: IScopeVariable | null
}

export interface ISymbolModifier {
	/**
	 * The parser content of the modifier.
	 */
	content: string,
	/**
	 * The source of the modifier instance.
	 * 
	 * Possible values are:
	 *     * shorthand
	 *     * parameter
	 */
	source: string,
	/**
	 * The parsed name of the modifier.
	 */
	name: string,
	/**
	 * The start offset of the modifier.
	 */
	startOffset: number,
	/**
	 * The end offset of the modifier.
	 */
	endOffset: number,
	/**
	 * The line the modifier appears on in the source document.
	 */
	line: number,
	/**
	 * Indicates if the modifier references a known registered modifier.
	 */
	hasRegisteredModifier: boolean,
	/**
	 * The modifier reference, if available.
	 */
	modifier: IModifier | null,
	/**
	 * A list of user-supplied arguments to the modifier.
	 */
	args: IModifierArgument[]
}

export interface ISymbolModifierCollection {
	/**
	 * Indicates if the collection has any valid modifiers.
	 */
	hasModifiers: boolean,
	/**
	 * Indicates if the collection contains parameter-style modifiers.
	 */
	hasParamModifiers: boolean,
	/**
	 * Indicates if the collection contains shorthand-style modifiers.
	 */
	hasShorthandModifiers: boolean,
	/**
	 * Indicates if the collection contains a mix of both modifier styles.
	 */
	hasMixedStyles: boolean,
	/**
	 * A collection of all modifiers, from both sources.
	 */
	modifiers: ISymbolModifier[],
	/**
	 * A collection of all parameter-style modifiers.
	 */
	paramModifiers: ISymbolModifier[],
	/**
	 * A collection of all shorthand-style modifiers.
	 */
	shorthandModifiers: ISymbolModifier[],
	/**
	 * The last modifier in the modifier call chain.
	 */
	trailingModifier: ISymbolModifier | null,
	/**
	 * The most specific return type from the last modifier in the call chain.
	 */
	manifestType: string
}

export interface IParameterAttribute {
	/**
	 * The user supplied parameter name.
	 */
	name: string,
	/**
	 * The user supplied parameter value.
	 */
	value: string,
	/**
	 * The offset at which the parameter value starts.
	 */
	contentStartsAt: number,
	/**
	 * The start offset of the entire parameter.
	 */
	startOffset: number,
	/**
	 * The end offset of the entire parameter.
	 */
	endOffset: number,
	/**
	 * Indicates if the parameter contains dynamic bindings (variable reference).
	 * 
	 * An example is ':src="variable"'.
	 */
	isDynamicBinding: boolean,
	/**
	 * Indicates if the parameter name contains multiple pieces.
	 * 
	 * An example is 'title:contains'.
	 */
	isCompound: boolean,
	/**
	 * Inddicates if the parameter value contains any interpolation ranges.
	 */
	containsInterpolation: boolean
	/**
	 * A list of all interpolation ranges within the parameter's value.
	 */
	interpolations: IVariableInterpolation[],
	/**
	 * Indicates if the parameter can be associated with a known modifier instance.
	 */
	isModifier: boolean,
	/**
	 * The associated modifier instance, if available.
	 */
	modifier: IModifier | null
}

export interface IVariableInterpolation {
	/**
	 * The user-supplied value of the interpolation range.
	 */
	value: string,
	/**
	 * The start offset of the interpolation range.
	 */
	startOffset: number,
	/**
	 * The end offset of the interpolation range.
	 */
	endOffset: number,
	/**
	 * A list of all symbols that represent the full range.
	 */
	symbols: ISymbol[]
}

export interface ISymbol {
	/**
	 * An internal identifier for the symbol.
	 * 
	 * This identifier is regenerated on each parser pass,
	 * and must not be relied upon to be consistent.
	 */
	id: string,
	/**
	 * Indicates if the symbol represents an Antlers comment.
	 */
	isComment: boolean,
	/**
	 * The parsed tag name.
	 */
	tagPart: string,
	/**
	 * The current scope the symbol belongs to, if available.
	 */
	currentScope: Scope | null,
	/**
	 * The scope variable attached to the symbol, if available.
	 */
	scopeVariable: IScopeVariable | null,
	/**
	 * The inferred data type the symbol is representing.
	 */
	sourceType: string,
	/**
	 * The inferred runtime type the symbol is representing.
	 * 
	 * This will differ from the sourceType property if
	 * a modifier has changed the symbol's data type.
	 */
	manifestType: string,
	/**
	 * Indicates if the symbol must have a closing tag.
	 */
	mustClose: boolean | null,
	/**
	 * A list of all associated user-defined parameters.
	 */
	parameterCache: IParameterAttribute[] | null,
	/**
	 * A list of all discovered parameter names.
	 */
	existingParamNames: string[],
	/**
	 * An adjusted tag name, with prefixes removed.
	 */
	name: string,
	/**
	 * The fully qualified tag name, composed of the analyzed name and method name.
	 */
	runtimeName: string,
	/**
	 * The parsed method name.
	 */
	methodName: string | null,
	/**
	 * The full parsed content of the symbol.
	 */
	content: string,
	/**
	 * The parsed content that includes all known parameters.
	 */
	parameterContent: string,
	/**
	 * The offset at which parameter content starts.
	 */
	parameterContentStart: number,
	/**
	 * The line at which parameter content starts.
	 */
	parameterContentStartLine: number,
	/**
	 * Indicates if the current symbol represents a closing tag.
	 */
	isClosingTag: boolean,
	/**
	 * The reference to the opening tag counterpart, if available.
	 */
	belongsTo: ISymbol | null,
	/**
	 * The reference to the closing tag counterpart, if available.
	 */
	isClosedBy: ISymbol | null,
	/**
	 * The runtime variable type instance, if available.
	 */
	runtimeType: IRuntimeVariableType | null,
	/**
	 * A collection of all parsed modifiers, if available.
	 */
	modifiers: ISymbolModifierCollection | null,
	/**
	 * The "name" given to the current scope, if any.
	 */
	scopeName: string | null,
	/**
	 * Indicates if the symbol can be resolved to a known Antlers tag.
	 */
	isTag: boolean,
	/**
	 * The start line of the symbol.
	 */
	startLine: number,
	/**
	 * The end line of the symbol.
	 */
	endLine: number,
	/**
	 * The start offset of the symbol.
	 */
	startOffset: number,
	/**
	 * The end offset of the symbol.
	 */
	endOffset: number,
	/**
	 * A reference to any internal specialized symbol representations.
	 */
	reference: any | null,
	/**
	/**
	 * Indicates if the symbol was created while parsing a variable interpolation range.
	 */
	isInterpolationSymbol: boolean
}

