import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxSelectBox, {
    dxSelectBoxOptions,
    CustomItemCreatingInfo,
} from './select_box';

import {
    ApplyValueMode,
    SelectAllMode,
} from '../common';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTagBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxTagBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTagBox>;

/** @public */
export type CustomItemCreatingEvent = EventInfo<dxTagBox> & CustomItemCreatingInfo;

/** @public */
export type DisposingEvent = EventInfo<dxTagBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTagBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTagBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxTagBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTagBox> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTagBox, KeyboardEvent>;

/** @public */
export type MultiTagPreparingEvent = Cancelable & EventInfo<dxTagBox> & {
    readonly multiTagElement: DxElement;
    readonly selectedItems?: Array<string | number | any>;
    text?: string;
};

/** @public */
export type OpenedEvent = EventInfo<dxTagBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTagBox> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxTagBox> & {
    readonly value: boolean;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxTagBox> & SelectionChangedInfo<string | number | any>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTagBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTagBoxOptions extends Pick<dxSelectBoxOptions<dxTagBox>, Exclude<keyof dxSelectBoxOptions<dxTagBox>, 'onSelectionChanged'>> {
    /**
     * @docid
     * @default "instantly"
     * @public
     */
    applyValueMode?: ApplyValueMode;
    /**
     * @docid
     * @default false
     * @public
     */
    hideSelectedItems?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxDisplayedTags?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    multiline?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTagBox
     * @type_function_param1_field selectedItems:Array<string,number,Object>
     * @action
     * @public
     */
    onMultiTagPreparing?: ((e: MultiTagPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTagBox
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field addedItems:Array<string,number,Object>
     * @type_function_param1_field removedItems:Array<string,number,Object>
     * @type_function_param1_field component:dxTagBox
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default 'page'
     * @public
     */
    selectAllMode?: SelectAllMode;
    /**
     * @docid
     * @readonly
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @default "Select All"
     * @public
     */
    selectAllText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default 1500
     * @public
     */
    maxFilterQueryLength?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    showMultiTagOnly?: boolean;
    /**
     * @docid
     * @default "tag"
     * @type_function_param1 itemData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    tagTemplate?: template | ((itemData: any, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default []
     * @public
     */
    value?: Array<string | number | any>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSelectBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTagBox extends dxSelectBox<dxTagBoxOptions> { }

/** @public */
export type Properties = dxTagBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxTagBoxOptions;
