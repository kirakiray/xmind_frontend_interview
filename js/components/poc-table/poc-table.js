Component(async (load) => {
    // 加载子组件
    await load("../poc-td -pack");

    let { initCategory } = await load("./pocTableUtil");

    return {
        tag: "poc-table",
        temp: true,
        hostcss: "./poc-table-host.css",
        proto: {
            // 专用导入csv数据的方法
            importCSV(csvData) {
                // 匹配单行
                let row_datas = csvData.split(/\n/g);

                // 生成元素数据并加入
                row_datas.forEach((rowStr, row_id) => {
                    let pocLine = $({
                        tag: "poc-tr"
                    });

                    let rowData = rowStr.split(/,/g);

                    rowData.forEach((tdData, tdId) => {
                        // 单元类型
                        let type = "";

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
                            isHead: row_id === 0 ? true : false,
                            val: tdData,
                            type
                        });

                        pocLine.push(pocTd);
                    });

                    this.push(pocLine);
                });
            },
            // 导入Category的方法
            importCategory(category) {
                initCategory(category);

                return this;
            }
        }
    };
});