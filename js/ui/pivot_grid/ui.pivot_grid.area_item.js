import { setWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import Class from '../../core/class';
import { getPublicElement } from '../../core/element';
import { extend } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { isDefined } from '../../core/utils/type';
import { setStyle } from '../../core/utils/style';
import domAdapter from '../../core/dom_adapter';
import { getMemoizeScrollTo } from '../../renovation/ui/common/utils/scroll/getMemoizeScrollTo';

const PIVOTGRID_EXPAND_CLASS = 'dx-expand';

const getRealElementWidth = function(element) {
    let width = 0;

    const offsetWidth = element.offsetWidth;

    if(element.getBoundingClientRect) {
        const clientRect = getBoundingRect(element);
        width = clientRect.width;

        if(!width) {
            width = clientRect.right - clientRect.left;
        }
        if(width <= offsetWidth - 1) {
            width = offsetWidth;
        }
    }

    return width > 0 ? width : offsetWidth;
};

function getFakeTableOffset(scrollPos, elementOffset, tableSize, viewPortSize) {
    let offset = 0;
    let halfTableCount = 0;
    const halfTableSize = tableSize / 2;

    if(scrollPos + viewPortSize - (elementOffset + tableSize) > 1) {

        if(scrollPos >= elementOffset + tableSize + halfTableSize) {
            halfTableCount = parseInt((scrollPos - (elementOffset + tableSize)) / halfTableSize, 10);
        }

        offset = (elementOffset + tableSize + (halfTableSize) * halfTableCount);
    } else if(scrollPos < elementOffset) {

        if(scrollPos <= elementOffset - halfTableSize) {
            halfTableCount = parseInt((scrollPos - (elementOffset - halfTableSize)) / halfTableSize, 10);
        }

        offset = elementOffset - (tableSize - (halfTableSize) * halfTableCount);
    } else {
        offset = elementOffset;
    }

    return offset;
}

///#DEBUG
export { getRealElementWidth };

///#ENDDEBUG

export const AreaItem = Class.inherit({
    ctor: function(component) {
        this.component = component;
    },

    option: function() {
        return this.component.option.apply(this.component, arguments);
    },

    _getRowElement: function(index) {
        const that = this;
        if(that._tableElement && that._tableElement.length > 0) {
            return that._tableElement[0].rows[index];
        }
        return null;
    },

    _createGroupElement: function() {
        return $('<div>');
    },

    _createTableElement: function() {
        return $('<table>');
    },

    _getCellText: function(cell, encodeHtml) {
        let cellText = cell.isWhiteSpace ? '&nbsp' : cell.text || '&nbsp';

        if(encodeHtml && (cellText.indexOf('<') !== -1 || cellText.indexOf('>') !== -1)) {
            cellText = $('<div>').text(cellText).html();
        }

        return cellText;
    },

    _getRowClassNames: function() {

    },

    _applyCustomStyles: function(options) {
        if(options.cell.width) {
            options.cssArray.push('min-width:' + options.cell.width + 'px');
        }
        if(options.cell.sorted) {
            options.classArray.push('dx-pivotgrid-sorted');
        }
    },

    _getMainElementMarkup: function() {
        return domAdapter.createElement('tbody');
    },

    _getCloseMainElementMarkup: function() {
        return '</tbody>';
    },

    _renderTableContent: function(tableElement, data) {
        const that = this;
        const rowsCount = data.length;
        let row;
        let cell;
        let i;
        let j;
        let rowElement;
        let cellElement;
        let cellText;
        const rtlEnabled = that.option('rtlEnabled');
        const encodeHtml = that.option('encodeHtml');
        let rowClassNames;

        tableElement.data('area', that._getAreaName());
        tableElement.data('data', data);

        tableElement.css('width', '');

        const tbody = this._getMainElementMarkup();

        for(i = 0; i < rowsCount; i++) {
            row = data[i];
            rowClassNames = [];

            const tr = domAdapter.createElement('tr');

            for(j = 0; j < row.length; j++) {

                cell = row[j];

                this._getRowClassNames(i, cell, rowClassNames);

                const td = domAdapter.createElement('td');


                if(cell) {
                    cell.rowspan && td.setAttribute('rowspan', (cell.rowspan || 1));
                    cell.colspan && td.setAttribute('colspan', (cell.colspan || 1));

                    const styleOptions = {
                        cellElement: cellElement,
                        cell: cell,
                        cellsCount: row.length,
                        cellIndex: j,
                        rowElement: rowElement,
                        rowIndex: i,
                        rowsCount: rowsCount,
                        rtlEnabled: rtlEnabled,
                        classArray: [],
                        cssArray: []
                    };

                    that._applyCustomStyles(styleOptions);

                    if(styleOptions.cssArray.length) {
                        setStyle(td, styleOptions.cssArray.join(';'));
                    }

                    if(styleOptions.classArray.length) {
                        td.setAttribute('class', styleOptions.classArray.join(' '));
                    }

                    if(isDefined(cell.expanded)) {
                        const div = domAdapter.createElement('div');
                        div.classList.add('dx-expand-icon-container');
                        const span = domAdapter.createElement('span');
                        span.classList.add(PIVOTGRID_EXPAND_CLASS);
                        div.appendChild(span);
                        td.appendChild(div);
                    }

                    cellText = this._getCellText(cell, encodeHtml);

                } else {
                    cellText = '';
                }

                const span = domAdapter.createElement('span');

                if(isDefined(cell.wordWrapEnabled)) {
                    span.style.whiteSpace = cell.wordWrapEnabled ? 'normal' : 'nowrap';
                }

                span.innerHTML = cellText;
                td.appendChild(span);

                if(cell.sorted) {
                    const span = domAdapter.createElement('span');
                    span.classList.add('dx-icon-sorted');
                    td.appendChild(span);
                }

                tr.appendChild(td);
            }

            if(rowClassNames.length) {
                tr.setAttribute('class', rowClassNames.join(' '));
            }
            tbody.appendChild(tr);
        }

        tableElement.append(tbody);

        this._triggerOnCellPrepared(tableElement, data);
    },

    _triggerOnCellPrepared: function(tableElement, data) {
        const that = this;
        const rowElements = tableElement.find('tr');
        const areaName = that._getAreaName();
        const onCellPrepared = that.option('onCellPrepared');
        const hasEvent = that.component._eventsStrategy.hasEvent('cellPrepared');
        let rowElement;
        let $cellElement;
        let onCellPreparedArgs;
        const defaultActionArgs = this.component._defaultActionArgs();
        let row;
        let cell;
        let rowIndex;
        let columnIndex;

        if(onCellPrepared || hasEvent) {
            for(rowIndex = 0; rowIndex < data.length; rowIndex++) {
                row = data[rowIndex];
                rowElement = rowElements.eq(rowIndex);

                for(columnIndex = 0; columnIndex < row.length; columnIndex++) {
                    cell = row[columnIndex];
                    $cellElement = rowElement.children().eq(columnIndex);
                    onCellPreparedArgs = {
                        area: areaName,
                        rowIndex: rowIndex,
                        columnIndex: columnIndex,
                        cellElement: getPublicElement($cellElement),
                        cell: cell
                    };
                    if(hasEvent) {
                        that.component._trigger('onCellPrepared', onCellPreparedArgs);
                    } else {
                        onCellPrepared(extend(onCellPreparedArgs, defaultActionArgs));
                    }
                }
            }
        }
    },

    _getRowHeight: function(index) {
        const row = this._getRowElement(index);
        let height = 0;

        const offsetHeight = row.offsetHeight;

        if(row && row.lastChild) {
            if(row.getBoundingClientRect) {
                const clientRect = getBoundingRect(row);
                height = clientRect.height;

                if(height <= offsetHeight - 1) {
                    height = offsetHeight;
                }
            }

            return height > 0 ? height : offsetHeight;
        }
        return 0;
    },

    _setRowHeight: function(index, value) {
        const row = this._getRowElement(index);
        if(row) {
            row.style.height = value + 'px';
        }
    },

    getRowsLength: function() {
        const that = this;
        if(that._tableElement && that._tableElement.length > 0) {
            return that._tableElement[0].rows.length;
        }
        return 0;
    },

    getRowsHeight: function() {
        const that = this;
        const result = [];
        const rowsLength = that.getRowsLength();
        let i;

        for(i = 0; i < rowsLength; i++) {
            result.push(that._getRowHeight(i));
        }
        return result;
    },

    setRowsHeight: function(values) {
        const that = this;
        let totalHeight = 0;
        const valuesLength = values.length;
        let i;

        for(i = 0; i < valuesLength; i++) {
            totalHeight += values[i];
            that._setRowHeight(i, values[i]);
        }

        this._tableHeight = totalHeight;
        this._tableElement[0].style.height = totalHeight + 'px';
    },

    getColumnsWidth: function() {
        const rowsLength = this.getRowsLength();
        let rowIndex;
        let row;
        let i;
        let columnIndex;
        const processedCells = [];
        const result = [];
        const fillCells = function(cells, rowIndex, columnIndex, rowSpan, colSpan) {
            let rowOffset;
            let columnOffset;
            for(rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
                for(columnOffset = 0; columnOffset < colSpan; columnOffset++) {
                    cells[rowIndex + rowOffset] = cells[rowIndex + rowOffset] || [];
                    cells[rowIndex + rowOffset][columnIndex + columnOffset] = true;
                }
            }
        };

        if(rowsLength) {
            for(rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
                processedCells[rowIndex] = processedCells[rowIndex] || [];
                row = this._getRowElement(rowIndex);
                for(i = 0; i < row.cells.length; i++) {
                    for(columnIndex = 0; processedCells[rowIndex][columnIndex]; columnIndex++);
                    fillCells(processedCells, rowIndex, columnIndex, row.cells[i].rowSpan, row.cells[i].colSpan);
                    if(row.cells[i].colSpan === 1) {
                        result[columnIndex] = result[columnIndex] || getRealElementWidth(row.cells[i]);
                    }
                }

            }
        }
        return result;
    },

    setColumnsWidth: function(values) {
        let i;
        const tableElement = this._tableElement[0];
        this._colgroupElement.html('');
        const columnsCount = this.getColumnsCount();
        const columnWidth = [];

        for(i = 0; i < columnsCount; i++) {
            columnWidth.push(values[i] || 0);
        }

        for(i = columnsCount; i < values.length && values; i++) {
            columnWidth[columnsCount - 1] += values[i];
        }

        for(i = 0; i < columnsCount; i++) {
            const col = domAdapter.createElement('col');
            col.style.width = columnWidth[i] + 'px';
            this._colgroupElement.append(col);
        }
        this._tableWidth = columnWidth.reduce((sum, width) => sum + width, 0);

        tableElement.style.width = this._tableWidth + 'px';
        tableElement.style.tableLayout = 'fixed';
    },

    resetColumnsWidth: function() {
        setWidth(this._colgroupElement.find('col'), 'auto');
        this._tableElement.css({
            width: '',
            tableLayout: ''
        });
    },

    setGroupWidth: function(value) {
        this._getScrollable().option('width', value);
    },

    setGroupHeight: function(value) {
        this._getScrollable().option('height', value);
    },

    getGroupHeight: function() {
        return this._getGroupElementSize('height');
    },

    getGroupWidth: function() {
        return this._getGroupElementSize('width');
    },

    _getGroupElementSize(dimension) {
        const size = this.groupElement()[0].style[dimension];

        if(size.indexOf('px') > 0) {
            return parseFloat(size);
        }

        return null;
    },

    groupElement: function() {
        return this._groupElement;
    },

    tableElement: function() {
        return this._tableElement;
    },

    element: function() {
        return this._rootElement;
    },

    headElement: function() {
        return this._tableElement.find('thead');
    },

    _setTableCss: function(styles) {
        if(this.option('rtlEnabled')) {
            styles.right = styles.left;
            delete styles.left;
        }

        this.tableElement().css(styles);
    },

    setVirtualContentParams: function(params) {
        this._virtualContent.css({
            width: params.width,
            height: params.height
        });

        const scrollable = this._getScrollable();

        if(scrollable?.isRenovated()) {
            this._getScrollable().option('classes', 'dx-virtual-mode');
        } else {
            this.groupElement().addClass('dx-virtual-mode');
        }
    },

    disableVirtualMode: function() {
        const scrollable = this._getScrollable();

        if(scrollable?.isRenovated()) {
            this._getScrollable().option('classes', '');
        } else {
            this.groupElement().removeClass('dx-virtual-mode');
        }
    },

    _renderVirtualContent: function() {
        const that = this;
        if(!that._virtualContent && that.option('scrolling.mode') === 'virtual') {
            that._virtualContent = $('<div>').addClass('dx-virtual-content').insertBefore(that._tableElement);
        }
    },

    reset: function() {
        const that = this;
        const tableElement = that._tableElement[0];

        that._fakeTable && that._fakeTable.detach();
        that._fakeTable = null;

        that.disableVirtualMode();
        that.setGroupWidth('100%');
        that.setGroupHeight('auto');

        that.resetColumnsWidth();

        if(tableElement) {
            for(let i = 0; i < tableElement.rows.length; i++) {
                tableElement.rows[i].style.height = '';
            }
            tableElement.style.height = '';
            tableElement.style.width = '100%';
        }
    },

    _updateFakeTableVisibility: function() {
        const that = this;
        const tableElement = that.tableElement()[0];
        const horizontalOffsetName = that.option('rtlEnabled') ? 'right' : 'left';
        const fakeTableElement = that._fakeTable[0];

        if(tableElement.style.top === fakeTableElement.style.top && fakeTableElement.style[horizontalOffsetName] === tableElement.style[horizontalOffsetName]) {
            that._fakeTable.addClass('dx-hidden');
        } else {
            that._fakeTable.removeClass('dx-hidden');
        }
    },

    _moveFakeTableHorizontally: function(scrollPos) {
        const that = this;
        const rtlEnabled = that.option('rtlEnabled');
        const offsetStyleName = rtlEnabled ? 'right' : 'left';
        const tableElementOffset = parseFloat(that.tableElement()[0].style[offsetStyleName]);
        const offset = getFakeTableOffset(scrollPos, tableElementOffset, that._tableWidth, that.getGroupWidth());
        if(parseFloat(that._fakeTable[0].style[offsetStyleName]) !== offset) {
            that._fakeTable[0].style[offsetStyleName] = offset + 'px';
        }
    },

    _moveFakeTableTop: function(scrollPos) {
        const that = this;
        const tableElementOffsetTop = parseFloat(that.tableElement()[0].style.top);
        const offsetTop = getFakeTableOffset(scrollPos, tableElementOffsetTop, that._tableHeight, that.getGroupHeight());

        if(parseFloat(that._fakeTable[0].style.top) !== offsetTop) {
            that._fakeTable[0].style.top = offsetTop + 'px';
        }
    },

    _moveFakeTable: function() {
        this._updateFakeTableVisibility();
    },

    _createFakeTable: function() {
        const that = this;

        if(!that._fakeTable) {
            that._fakeTable = that.tableElement()
                .clone()
                .addClass('dx-pivot-grid-fake-table')
                .appendTo(that._virtualContent);
        }
    },

    render: function(rootElement, data) {
        const that = this;

        if(that._tableElement) {
            try {
                that._tableElement[0].innerHTML = '';
            } catch(e) {
                that._tableElement.empty();
            }
            that._tableElement.attr('style', '');
        } else {
            that._groupElement = that._createGroupElement();
            that._tableElement = that._createTableElement();

            that._tableElement.appendTo(that._groupElement);
            that._groupElement.appendTo(rootElement);
            that._rootElement = rootElement;
        }

        that._colgroupElement = $('<colgroup>').appendTo(that._tableElement);
        that._renderTableContent(that._tableElement, data);

        that._renderVirtualContent();
    },

    _getScrollable: function() {
        return this.groupElement().data('dxScrollable');
    },

    _getMemoizeScrollTo: function() {
        this._memoizeScrollTo = this._memoizeScrollTo ?? getMemoizeScrollTo(() => this._getScrollable());
        return this._memoizeScrollTo;
    },

    _getMaxLeftOffset(scrollable) {
        const containerElement = $(scrollable.container()).get(0);

        return containerElement.scrollWidth - containerElement.clientWidth;
    },

    on: function(eventName, handler) {
        const that = this;
        const scrollable = that._getScrollable();

        if(scrollable) {
            scrollable.on(eventName, function(e) {
                if(that.option('rtlEnabled') && isDefined(e.scrollOffset.left)) {
                    e.scrollOffset.left = that._getMaxLeftOffset(scrollable) - e.scrollOffset.left;
                }
                handler(e);
            });
        }
        return this;
    },

    off: function(eventName) {
        const scrollable = this._getScrollable();
        if(scrollable) {
            scrollable.off(eventName);
        }
        return this;
    },
    scrollTo(pos, force = false) {
        const scrollable = this._getScrollable();
        if(!scrollable) {
            return;
        }

        const rtlEnabled = this.option('rtlEnabled');
        const areaName = this._getAreaName();
        const scrollablePos = {
            ...pos,
            left: rtlEnabled && (areaName === 'column' || areaName === 'data')
                ? this._getMaxLeftOffset(scrollable) - pos.left
                : pos.left,
        };

        const memoizeScrollTo = this._getMemoizeScrollTo();
        memoizeScrollTo(scrollablePos, force);

        if(this._virtualContent) {
            this._createFakeTable();
            this._moveFakeTable(pos);
        }
    },

    updateScrollable: function() {
        const scrollable = this._getScrollable();
        if(scrollable) {
            return scrollable.update();
        }
    },

    getColumnsCount: function() {
        let columnCount = 0;
        const row = this._getRowElement(0);
        let cells;

        if(row) {
            cells = row.cells;
            for(let i = 0, len = cells.length; i < len; ++i) {
                columnCount += cells[i].colSpan;
            }
        }

        return columnCount;
    },

    getData: function() {
        const tableElement = this._tableElement;
        return tableElement ? tableElement.data('data') : [];
    }
});
