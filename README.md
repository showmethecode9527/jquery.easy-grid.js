# jquery.easy-grid.js
a easy jquery plugin of grid

## 用法
``` JavaScript
$(selector).easyGrid(options)
```

### 配置项(options)
``` JavaScript
{
    // {Boolean} 是否显示表头, 可缺省(默认为false)
    showHeader: true,
    // 表头字段, 当showHeader为false时无效
    header: ['姓名', '学号', '手机', '班级'],
    // 每列对应的key, 当dataFlag为1时无效
    colKey: ['name', 'studentID', 'mobile', 'class'],
    valMap: {
        studentID: {
            '7': '学号是7'
        }
    },
    verification: {
        studentID: {
            pattern: /\d{9}/g,
            tips: '请填入9位数字'
        }
    },
    // 列宽, 数组或对象形式(建议不要配置该项, 而是通过样式表进行设置)
    // 如果是数组, 则需要与colKey一一对应
    // 注意: 各列的宽如果都是百分比, 则其和不能超过100%(即colWidth, selectColWidth, operateCol.width之和)
    colWidth: ['20%', '20%', '20%', '20%'],
    // {Array} 可选参数
    // 当表格可以修改时, 如果key所对应的值不可修改
    primaryKey: ['studentID'],
    // {Boolean} 是否显示选择列, 可缺省(默认值为false)
    // 如果为true, 则表格会增加1列，每列的单元格中显示一个复选按钮
    showSelectCol: true,
    // 选择列的宽, 可缺省(默认值为'0'), 当且仅当showSelectCol为true时有效
    // 注意: 各列的宽如果都是百分比, 则其和不能超过100%(即colWidth, selectColWidth, operateCol.width之和)
    selectColWidth: '5%',
    // jquery选择器, 当点击该元素时, 批量删除选中的行
    delRowsSelector: '#del-rows',
    delRowsFn: delRows,
    // {Boolean} 是否显示操作列, 可缺省(默认值为false)
    // 如果为true, 则增加1列操作列(包含"修改"、"删除"功能)
    showOperateCol: true,
    // 操作列的配置项, 当showOperateCol为false时, 该值无效
    // 注意: 各列的宽如果都是百分比, 则其和不能超过100%(即colWidth, selectColWidth, operateCol.width之和)
    operateCol: {
        // 操作列的表头
        header: '操作',
        // 操作列的宽
        width: '15%',
        // 保存项配置
        update: {
            text: '修改',
            // 点击保存时, 执行的回调函数
            fn: update
        },
        // 删除项配置
        del: {
            text: '删除',
            // 点击删除时, 执行的回调函数
            // 注意: 该方法必须返回一个布尔值
            fn: del
        },
        save: {
            text: '保存',
            // 点击保存时, 执行的回调函数
            // 注意: 该方法必须返回一个布尔值
            fn: save
        },
        cancel: {
            text: '取消',
            fn: cancel
        }
    },
    // {Boolean} 是否支持增加行, 可缺省(默认值为false)
    // 如果为true, 则showOperateCol也必须为true(因为增加行以后, 需要有地方放保存按钮)
    showAddRow: true,
    // 增加行的配置参数, 当showAddRow为false时无效
    // 目标元素(即点击该元素后将执行增加行的操作)的选择器
    addRowSelector: '#add',
    // {String} 在表格首行还是尾行插入
    // 'start': 首行, 'end'(默认值): 尾行
    addRowPosition: 'start',
    // 新增时不可填字段, 可缺省
    // 新增行的时候, 哪些是不需要手动填写的
    // 比如修改的时候不能修改"studentID", 但是新增的时候可能就需要填上"studentID"
    addRowPrimaryKey: ['studentID'],
    // 新增行的时候, 不可填字段的默认值
    // 注意: addRowPrimaryKeyDefaultVal必须与addRowPrimaryKey一一对应
    //       如果对key没有默认值, 则填''
    addRowPrimaryKeyDefaultVal: ['1'],
    // {Boolean} 是否显示分页, 可缺省(默认值为false)
    showPager: true,
    pagerSize: 10,
    // 数据源格式, 可缺省
    // 0(默认值): 对象数组, 1: 二维数组
    dataFlag: 0,
    // 必填字段
    // 数据源, 支持对象数组和二维数组(暂不支持)
    data: [],
    renderedCallback: function () {
        console.log('rendered');
    },
    savedCallback: function ($currentRow) {
        console.log('saved');
        console.log($currentRow);
    },
    deletedCallback: function () {
        console.log('deleted');
    }
}
```

