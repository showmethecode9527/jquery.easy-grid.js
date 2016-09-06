/*!
 * 表格插件
 * @author Mathink 2016-09-03
 * @dependences jquery
 *              jquery.easy-grid.css
 */
;(function ($) {
    'use strict';
    $.fn.easyGrid = function (userConf) {
        // 默认配置项
        var defaultConf = {
            dataFlag: 0,
            showHeader: false,
            showSelectCol: false,
            selectColWidth: '0',
            showAddRow: false,
            showOperateCol: false,
            addRowPosition: 'end',
            delRowsSelector: '',
            delRowsFn: '',
            addRowPrimaryKey: [],
            addRowPrimaryKeyDefaultVal: [],
            primaryKey: [],
            showPager: false,
            pagerSize: 10
        };
        // 获取用户配置项
        var conf = $.extend(defaultConf, userConf);
        return this.each(function () {
            // 检查配置项
            var confResult = checkConf(conf);
            if (confResult) {
                var $me = $(this);
                $me.data('easyGridConf', conf);
                // 生成节点
                generateGrid($me);
                // 设置样式
                setStyles($me);
                // 事件注册
                addEvent($me);
                // $.fn.easyGrid.update = function (data) {
                //     console.log($me);
                // };
            }
        });

        /**
         * 生成grid节点
         * @author Mathink 2016-09-03T23:29:40+0800
         * @param  {jQuery Object} $obj 当前对象
         */
        function generateGrid($obj) {
            var conf = $obj.data('easyGridConf');
            // 源数据标志, 0: 对象数组, 1: 二维数组
            var dataFlag = parseInt(conf.dataFlag, 10);
            // 是否显示表头
            var showHeader = conf.showHeader;
            // 是否显示操作列
            var showOperateCol = conf.showOperateCol;
            // 是否显示"选择列"
            var showSelectCol = conf.showSelectCol;
            // 表格源数据
            var data = conf.data;

            var gridStr = '<div class="easy-grid">';

            // 如果源数据是对象数组
            if (dataFlag === 0) {
                var colKey = conf.colKey;

                var bodyParam = {
                    colKey: colKey,
                    showSelectCol: showSelectCol,
                    showOperateCol: showOperateCol,
                    operateCol: conf.operateCol
                };
                // 如果用户没有配置表头, 或者将表头配置为false
                if (showHeader.toString() === 'false') {
                    // gridStr = generateGridBody(data, colKey);
                    gridStr += generateGridBody(data, bodyParam);
                } else {
                    // 表头字段, 当showHeader为false时无效
                    var header = conf.header;
                    // 1. 生成表头
                    gridStr += generateGridHeader(header, showSelectCol, showOperateCol, conf.operateCol);
                    // 2. 生成表格主体内容
                    gridStr += generateGridBody(data, bodyParam);
                }
            } else {
                console.log('源数据是二维数组');
            }
            
            gridStr += '</div>';
            $obj.html(gridStr);
        }

        /**
         * 生成表头
         * @author Mathink 2016-09-04T00:08:27+0800
         * @param  {Array}   headerAry      表头项数据: ['姓名', '学号', '手机', '班级']
         * @param  {Boolean} showSelectCol  是否显示"选择列"
         * @param  {Boolean} showOperateCol 是否显示操作列
         * @param  {Object}  operateCol     操作列的配置参数
         * @return {[type]}                 [description]
         */
        function generateGridHeader(headerAry, showSelectCol, showOperateCol, operateCol) {
            if (typeof headerAry === 'undefined') {
                return '';
            } else {
                var str = '<div class="easy-grid-header">' +
                            '<div class="easy-grid-row">';

                // 是否显示"选择列"
                if (showSelectCol.toString() === 'true') {
                    str +=  '<div class="easy-grid-col col-select">' +
                                '<input type="checkbox" class="select-row select-row-all">' +
                            '</div>';
                }

                headerAry.forEach(function (v) {
                    str += '<div class="easy-grid-col col-default">' + v + '</div>';
                });

                if (showOperateCol.toString() === 'true') {
                    str += '<div class="easy-grid-col col-operate">' + operateCol.header + '</div>';
                }

                str += '</div></div>';
                return str;
            }
        }

        /**
         * 生成表格主体内容
         * @author Mathink 2016-09-03T23:35:30+0800
         * @param  {Array}  data        对象数组或二维数组
         * @param  {Array}  param 配置参数: {colKey: [], showOperateCol: true, operateCol: {}}
         * @return {String} str         表格主体内容DOM字符串
         */
        function generateGridBody(data, param) {
            var colKey = param.colKey;
            var showOperateCol = param.showOperateCol;
            var showSelectCol = param.showSelectCol;
            var operateCol = param.operateCol;
            var updateStr = '', delStr = '', saveStr = '', cancelStr = '';
            if (typeof operateCol !== 'undefined') {
                if (typeof operateCol.update !== 'undefined') {
                    updateStr = operateCol.update.text || '';
                }
                if (typeof operateCol.del !== 'undefined') {
                    delStr = operateCol.del.text || '';
                }
                if (typeof operateCol.save !== 'undefined') {
                    saveStr = operateCol.save.text || '';
                }
                if (typeof operateCol.cancel !== 'undefined') {
                    cancelStr = operateCol.cancel.text || '';
                }
            }

            var str = '<div class="easy-grid-body">';
            
            if (typeof colKey === 'undefined') {
                console.log('源数据是二维数组');
            } else {
                data.forEach(function (v) {
                    str += '<div class="easy-grid-row">';
                    // 如果配置了"选择列"
                    if (showSelectCol.toString() === 'true') {
                        str +=  '<div class="easy-grid-col col-select">' +
                                    '<input type="checkbox" class="select-row">' +
                                '</div>';
                    }

                    colKey.forEach(function (keyItem) {
                        // 类名"col-default"表示基础列, 即由源数据直接产生的
                        // 与之相对应的是"col-select"和"col-operate"
                        str += '<div class="easy-grid-col col-default" data-key="' + keyItem + '">' + v[keyItem] + '</div>';
                    });

                    if (showOperateCol.toString() === 'true') {
                        str +=  '<div class="easy-grid-col col-operate">' +
                                    // 修改(默认显示)
                                    '<button class="btn btn-operate btn-update">' + updateStr + '</button>' +
                                    // 删除(默认显示)
                                    '<button class="btn btn-operate btn-del">' + delStr + '</button>' +
                                    // 保存(默认不显示, 点击"修改"后显示)
                                    '<button class="btn btn-operate btn-save">' + saveStr + '</button>' +
                                    // 取消(默认不显示, 点击"修改"后显示)
                                    '<button class="btn btn-operate btn-cancel">' + cancelStr + '</button>' +
                                    // 取消(默认不显示, 增加行后显示)
                                    '<button class="btn btn-operate btn-undo">' + cancelStr + '</button>' +
                                '</div>';
                    }

                    str += '</div>';
                });
            }

            str += '</div>';

            return str;
        }

        /**
         * 根据用户配置重设样式
         * @author Mathink 2016-09-04T00:01:07+0800
         * @param  {[type]} $obj [description]
         */
        function setStyles($obj) {
            var conf = $obj.data('easyGridConf');
            var showSelectCol = conf.showSelectCol.toString();
            var showOperateCol = conf.showOperateCol.toString();
            var colWidth = conf.colWidth;

            // 如果没有

            // 设置列宽
            if (typeof colWidth === 'undefined') {
                return;
            } else if ($.isArray(colWidth)) {
                // todo: 可优化配置项
                var operateColWidth = 0;
                var selectColWidth = conf.selectColWidth;
                try {
                    operateColWidth = conf.operateCol.width;
                } catch (e) {
                    console.log(e);
                }
                var $me;
                // 对应行先迭代(因为行中的列是按配置中对应的key生成的)
                // todo: 可考虑增加colWidth为对象数组的支持
                $obj.find('.easy-grid-row').each(function () {
                    $me = $(this);
                    $me.children('.col-default').each(function (i) {
                        // 这里不能直接使用width()方法(当width为百分数时会出问题)
                        // $(this).width(colWidth[i]);
                        if (parseInt(colWidth[i], 10) === 0) {
                            // 添加类名, 便于清空默认样式
                            $(this).addClass('hide');
                        }
                        this.style.width = colWidth[i];
                    });
                    if (showSelectCol === 'true') {
                        $me.children('.col-select')[0].style.width = selectColWidth;
                    }
                    if (showOperateCol === 'true') {
                        $me.children('.col-operate')[0].style.width = operateColWidth;
                    }
                });
                // $obj.find('.col-select')[0].style.width = selectColWidth;
                // $obj.find('.col-operate')[0].style.width = operateColWidth;
            }

            // 默认隐藏"保存"、"取消"按钮(当点击"修改"时显示)
            $obj.find('.btn-save, .btn-cancel, .btn-undo').hide();
        }

        /**
         * 事件注册
         * @author Mathink 2016-09-04T08:31:21+0800
         * @param  {[type]} $obj [description]
         */
        function addEvent($obj) {
            var conf = $obj.data('easyGridConf');
            var showOperateCol = conf.showOperateCol;
            var showSelectCol = conf.showSelectCol;
            var delRowsSelector = conf.delRowsSelector;
            var showAddRow = conf.showAddRow;

            // 如果显示操作列
            if (showOperateCol.toString() === 'true') {
                // 通过配置项传来的回调
                var saveCallback = conf.operateCol.save.fn;
                var delCallback = conf.operateCol.del.fn;
                addUpdateEvent($obj, conf.primaryKey);
                addCacelEvent($obj);
                addDelEvent($obj, delCallback);
                addSaveEvent($obj, saveCallback);

                if (showAddRow.toString() === 'true') {
                    addAddRowEvent($obj, $(conf.addRowSelector), conf.addRowPosition);
                }
            }

            // 如果显示"选择列"
            if (showSelectCol.toString() === 'true') {
                addSelectRowEvent($obj);

                var $delRowsNode = $(delRowsSelector);
                if ($delRowsNode.length !== 0) {
                    addDelRowsEvent($obj, $delRowsNode);
                }
            }
        }

        /**
         * 添加行操作
         * @author Mathink 2016-09-04T13:21:21+0800
         * @param  {[type]} $obj     [description]
         * @param  {[type]} $btn     [description]
         * @param  {[type]} position [description]
         */
        function addAddRowEvent($obj, $btn, position) {
            $btn.on('click', function () {
                if ($(this).hasClass('off')) {
                    return;
                }
                // 每次只能增加一行(如果新增的行没有保存, 则不能再增加新的行)
                $(this).addClass('off');
                var $gridBody = $obj.find('.easy-grid-body');
                // var $rowCopy;

                copyRow($obj, $gridBody, position);
                // 在首行插入
                // if (position === 'start') {
                //     $rowCopy = $gridBody.children('.easy-grid-row:eq(0)').clone(true);
                //     // 如果首行正处于修改状态
                //     if ($rowCopy.hasClass('row-editable')) {
                //         $rowCopy.find('.edit-status').val('').attr('placeholder', '')
                //             .end().find('.btn-cancel').hide().siblings('.btn-undo').show();
                //         $rowCopy.prependTo($gridBody);
                //         $gridBody.find('.can-update:eq(0)').focus();
                //         // 取消增加行事件(保存事件已克隆)
                //         addUndoEvent($obj);
                //     } else {
                //         var addRowPrimaryKey = $obj.data('easyGridConf').addRowPrimaryKey;
                //         var $col;
                //         $rowCopy.addClass('row-editable').find('.col-default').each(function () {
                //             $col = $(this);
                //             if ($.inArray($col.attr('data-key'), addRowPrimaryKey) === -1) {
                //                 $col.html('<input type="text" class="edit-status" placeholder="">');
                //             } else {
                //                 $col.html('<input type="text" class="edit-status" disabled title="该项不可修改" placeholder="">');
                //             }
                //         }).siblings('.col-operate').find('.btn-update, .btn-del, .btn-cancel').hide().siblings('.btn-save, .btn-undo').show();
                //         $rowCopy.prependTo($gridBody);
                //         $gridBody.find('.can-update:eq(0)').focus();
                //         // 取消增加行事件(保存事件已克隆)
                //         addUndoEvent($obj);
                //     }
                // } else {
                //     // 在尾行追加
                //     $rowCopy = $gridBody.children('.easy-grid-row:eq(0)').clone(true);
                // }
            });
        }

        function copyRow($obj, $gridBody, flag) {
            var $rowCopy;
            if (flag === 'start') {
                $rowCopy = $gridBody.children('.easy-grid-row:eq(0)').clone(true);
            } else {
                $rowCopy = $gridBody.children('.easy-grid-row:last').clone(true);
            }

            var addRowPrimaryKey = $obj.data('easyGridConf').addRowPrimaryKey;
            var addRowPrimaryKeyDefaultVal = $obj.data('easyGridConf').addRowPrimaryKeyDefaultVal;
            var $col, keyIndex;
            // 如果首行/尾行正处于修改状态
            if ($rowCopy.hasClass('row-editable')) {
                $rowCopy.find('.edit-status').val('').attr('placeholder', '')
                    .end().find('.btn-cancel').hide().siblings('.btn-undo').show();
                $rowCopy.find('.col-default').each(function () {
                    $col = $(this);
                    keyIndex = $.inArray($col.attr('data-key'), addRowPrimaryKey);
                    if (keyIndex === -1) {
                        $col.children('.edit-status').removeAttr('disabled');
                    } else {
                        // 2016-9-5 15:52:24 增加不可修改行的默认值
                        $col.children('.edit-status').val(addRowPrimaryKeyDefaultVal[keyIndex]);
                    }
                });
                if (flag === 'start') {
                    $rowCopy.prependTo($gridBody);
                } else {
                    $gridBody.append($rowCopy);
                }
                $rowCopy.find('.edit-status:eq(0)').focus();
                // "取消增加行"事件(保存事件已克隆)
                addUndoEvent($obj);
            } else {
                $rowCopy.addClass('row-editable').find('.col-default').each(function () {
                    $col = $(this);
                    keyIndex = $.inArray($col.attr('data-key'), addRowPrimaryKey);
                    if (keyIndex === -1) {
                        $col.html('<input type="text" class="edit-status" placeholder="">');
                    } else {
                        // 2016-9-5 15:52:24 增加不可修改行的默认值
                        $col.html('<input type="text" class="edit-status" disabled title="该项不可修改" placeholder="">')
                            .find('.edit-status').val(addRowPrimaryKeyDefaultVal[keyIndex]);
                    }
                }).siblings('.col-operate').find('.btn-update, .btn-del, .btn-cancel').hide().siblings('.btn-save, .btn-undo').show();
                if (flag === 'start') {
                    $rowCopy.prependTo($gridBody);
                } else {
                    $gridBody.append($rowCopy);
                }
                $rowCopy.find('.edit-status:eq(0)').focus();
                // 取消增加行事件(保存事件已克隆)
                addUndoEvent($obj);
            }
        }

        /**
         * [addUndoEvent description]
         * @author Mathink 2016-09-04T13:26:05+0800
         * @param  {[type]} $obj [description]
         */
        function addUndoEvent($obj) {
            $obj.find('.btn-undo').on('click', function () {
                $(this).closest('.easy-grid-row').animate({
                    height: 0,
                    opacity: 0
                }, 300, function () {
                    try {
                        $($obj.data('easyGridConf').addRowSelector).removeClass('off');
                    } catch (e) {
                        console.warn(e);
                    }
                    $(this).remove();
                });
            });
        }

        /**
         * 修改事件
         * @author Mathink 2016-09-04T10:04:07+0800
         * @param  {[type]} $obj       [description]
         * @param  {[type]} primaryKey [description]
         */
        function addUpdateEvent($obj, primaryKey) {
            var $col, colVal, $btn;
            // var keys = typeof primaryKey === 'undefined' ? [] : primaryKey;
            // $obj.find('.btn-update').
            $obj.find('.btn-update').on('click', function () {
                $btn = $(this);
                // 1. 隐藏"修改"、"删除"按钮, 显示"保存"、"取消"
                $btn.hide().siblings('.btn-del').hide()
                    .siblings('.btn-save, .btn-cancel').show()
                // 2. 将其他列置为可编辑状态
                    .closest('.col-operate').siblings('.col-default').each(function () {
                        $col = $(this);
                        colVal = $col.text();
                        if ($.inArray($col.attr('data-key'), primaryKey) > -1) {
                            $col.html('<input type="text" class="edit-status" disabled title="该项不可修改" placeholder="' + colVal + '">').children('.edit-status').val(colVal);
                        } else {
                            $col.html('<input type="text" class="edit-status can-update" placeholder="' + colVal + '">').children('.edit-status').val(colVal);
                        }
                    });
                // 3. 首个编辑框获得焦点
                $btn.closest('.easy-grid-row').addClass('row-editable').find('.edit-status.can-update:eq(0)').focus().select();
            });
        }

        /**
         * 删除事件
         * @author Mathink 2016-09-04T10:15:21+0800
         * @param  {[type]}   $obj     [description]
         * @param  {Function} callback [description]
         */
        function addDelEvent($obj, callback) {
            $obj.find('.btn-del').on('click', function () {
                if (typeof callback === 'function') {
                    var $currentRow = $(this).closest('.easy-grid-row');
                    // 读取行数据
                    var rowData = fetchRowData($currentRow);
                    var delResult = callback(rowData);
                    if (delResult) {
                        $(this).closest('.easy-grid-row').animate({
                            height: 0,
                            opacity: 0
                        }, 300, 'swing', function () {
                            $(this).remove();
                        });
                    } else {
                        console.warn('删除失败');
                    }
                }
            });            
        }

        /**
         * 保存事件
         * @author Mathink 2016-09-04T10:24:18+0800
         * @param  {[type]}   $obj     [description]
         * @param  {Function} callback 保存方法
         */
        function addSaveEvent($obj, callback) {
            var $btn;
            $obj.find('.btn-save').on('click', function () {
                if (typeof callback === 'function') {
                    var $currentRow = $(this).closest('.easy-grid-row');
                    // 读取行数据
                    var rowData = fetchRowData($currentRow);
                    var saveResult = callback(rowData);

                    if (saveResult) {
                        var val;
                        $btn = $(this);
                        $btn.closest('.easy-grid-row').find('.edit-status').each(function () {
                            val = this.value;
                            $(this).parent().html(val);
                        });
                        // 隐藏"保存"、"取消"按钮, 显示"修改"、"删除"
                        $btn.hide().siblings('.btn-cancel, .btn-undo').hide().siblings('.btn-update, .btn-del').show().closest('.easy-grid-row').removeClass('row-editable');
                        try {
                            $($obj.data('easyGridConf').addRowSelector).removeClass('off');
                        } catch (e) {
                            console.warn(e);
                        }
                    } else {
                        console.warn('保存失败');
                    }
                }
            });
        }

        /**
         * 取消事件
         * @author Mathink 2016-09-04T10:04:31+0800
         * @param  {[type]} $obj [description]
         */
        function addCacelEvent($obj) {
            var $btn;
            $obj.find('.btn-cancel').on('click', function () {
                var val;
                $btn = $(this);
                $btn.closest('.easy-grid-row').find('.edit-status').each(function () {
                    val = this.getAttribute('placeholder');
                    $(this).parent().html(val);
                });
                // 隐藏"保存"、"取消"按钮, 显示"修改"、"删除"
                $btn.hide().siblings('.btn-save').hide().siblings('.btn-update, .btn-del').show().closest('.easy-grid-row').removeClass('row-editable');
            });
        }

        /**
         * "选择行"事件
         *     1. 点击内容中的复选按钮, 整行添加类名'selected'(方便控制样式, 取数据等)
         *     2. 点击表头的复选按钮, 选中所有行, 再次点击, 取消选中所有行
         *     3. 每次点击时, 都将选中行的数据缓存到$obj上(为避免性能问题, 暂不提供)
         * @author Mathink 2016-09-05T23:31:24+0800
         * @param  {[type]} $obj [description]
         */
        function addSelectRowEvent($obj) {
            // 点击内容中的复选按钮
            $obj.find('.easy-grid-body .select-row').on('click', function () {
                // 整行切换类名"selected"
                $(this).closest('.easy-grid-row').toggleClass('selected');
                // 缓存数据(暂不缓存)
            });

            // 点击表头中的复选框
            $obj.find('.easy-grid-header .select-row').on('click', function () {
                var $me = $(this);
                var $headerRow = $me.closest('.easy-grid-row');
                if ($headerRow.hasClass('selected')) {
                    $obj.find('.easy-grid-body .select-row:checked').trigger('click');
                    $headerRow.removeClass('selected');
                } else {
                    $obj.find('.easy-grid-body .select-row:not(:checked)').trigger('click');
                    $headerRow.addClass('selected');
                }
            });
        }
        
        /**
         * 批量删除事件
         * @author Mathink 2016-09-06T00:10:26+0800
         * @param  {[type]} $obj  [description]
         * @param  {[type]} $node 批量删除按钮
         */
        function addDelRowsEvent($obj, $node) {
            $node.on('click', function () {
                var selectedData = [];
                var delRowsFn = $obj.data('easyGridConf').delRowsFn;
                // 获取所有选中行数据
                $obj.find('.easy-grid-body .easy-grid-row.selected').each(function () {
                    selectedData.push(fetchRowData($(this)));
                });

                if (typeof delRowsFn === 'function') {
                    delRowsFn(selectedData);
                }
            });            
        }

        /**
         * 获取行数据
         * @author Mathink 2016-09-04T10:52:34+0800
         * @param  {jQuery Object} $row    当前行
         * @return {Object}        rowData 行数据
         */
        function fetchRowData($row) {
            var rowData = {};
            var $col;

            // 如果是编辑状态, 则取input的值
            if ($row.hasClass('row-editable')) {
                $row.find('[data-key]').each(function () {
                    $col = $(this);
                    rowData[$col.attr('data-key')] = $col.children('.edit-status').val();
                });
            } else {
                $row.find('[data-key]').each(function () {
                    $col = $(this);
                    rowData[$col.attr('data-key')] = $col.text();
                });
            }
            
            return rowData;
        }

        /**
         * 检查用户配置项
         * @author Mathink 2016-09-03
         * @param  {Object}  conf 用户的配置信息
         * @return {Boolean}
         *
         * @todo dataFlag与data是否一致等
         */
        function checkConf(conf) {
            // 首先检查源数据格式
            var confData = conf.data;
            if ($.isArray(confData)) {
                if (typeof confData[0] === 'undefined') {
                    console.error('"data"参数必须是对象数组或二维数组!');
                    return false;
                }
            } else {
                console.error('"data"参数必须是数组!');
                return false;
            }
            return true;
        }
    };
})(jQuery);