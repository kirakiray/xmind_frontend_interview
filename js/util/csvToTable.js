define(async (load) => {
    return function (csvData) {
        // 匹配单行
        let row_datas = csvData.split(/\n/g);

        let $frag = $(document.createDocumentFragment());

        // 生成元素数据并加入
        row_datas.forEach((rowStr, row_id) => {
            let pocLine = $({
                tag: "poc-tr"
            });

            if (row_id === 0) {
                pocLine.style.order = -1000000;
            }

            let rowData = rowStr.split(/,/g);

            rowData.forEach((tdData, tdId) => {
                // 单元类型
                let type = "";
                // let monthTime = "";

                switch (tdId) {
                    case 0:
                        type = "TYPE";
                        break;
                    case 1:
                        type = "TIME";
                        break;
                    case 2:
                        type = "CATEGORY";
                        break;
                    case 3:
                        type = "AMOUNT";
                        break;
                }

                let pocTd = $({
                    // 第一行属于标题
                    tag: "poc-td",
                    isHead: row_id === 0 ? true : "",
                    val: tdData,
                    type: row_id === 0 ? "" : type,
                    // 月份时间
                    // monthTime
                });

                pocLine.push(pocTd);
            });

            $frag.push(pocLine);
        });

        return $frag;
    }
});