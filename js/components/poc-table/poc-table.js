Component(async (load) => {
    // 加载子组件
    await load("../poc-td -pack");

    let { initCategory } = await load("./pocTableUtil");

    return {
        tag: "poc-table",
        temp: true,
        hostcss: "./poc-table-host.css",
        data: {
            amount: 1000,
            _old_monthSets: "",
            // 下面为left-pannel同步过来的数据
            // 排序类型
            sortType: "",
            // 类型
            sType: "",
            // 时间
            sTime: "",
            // 类别
            sCate: "",
        },
        watch: {
            // 通过根据sortType监听变动
            sortType(e, sortType) {
                this.display = "none";
                switch (sortType) {
                    case "time":
                        this.forEach((tr, i) => {
                            if (i == 0) return;

                            tr.style.order = parseInt(tr[1].val / 86400000);
                        });
                        break;
                    case "timeRev":
                        this.forEach((tr, i) => {
                            if (i == 0) return;

                            tr.style.order = -parseInt(tr[1].val / 86400000);
                        });

                        break;
                    default:
                        this.forEach((tr, i) => {
                            if (i == 0) return;
                            tr.style.order = null
                        });
                }
                this.display = "";
            },
            sTime() {
                this.refreshList();
            },
            sType() {
                this.refreshList();
            },
            sCate() {
                this.refreshList();
            }
        },
        slotchange() {
            // 更新月份信息
            this.judgeUpdateMonth();

            // 更新总价格
            this.reloadAmount();
        },
        proto: {
            refreshList() {
                let { sTime, sType, sCate } = $("left-pannel");

                this.queAll('poc-tr').forEach((tr, rowId) => {
                    if (rowId === 0) {
                        return
                    }

                    let show = true;

                    // 月份筛选
                    let date = new Date(parseInt(tr[1].val));
                    let monthTime = date.getFullYear() + "-" + (date.getMonth() + 1);
                    if (sTime != "all" && sTime != monthTime) {
                        show = false;
                    }

                    if (sCate != "all" && sCate != tr[2].val) {
                        show = false;
                    }

                    // 类型筛选
                    if (sType != "all" && sType != tr[0].val) {
                        show = false;
                    }

                    tr.attrs.hide = show ? "" : "true";
                });

                // 更新统计数据
                this.reloadAmount();
            },
            // 专用导入csv数据的方法
            importCSV(csvData) {
                // 匹配单行
                let row_datas = csvData.split(/\n/g);

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

                    this.push(pocLine);
                });
            },
            // 是否更新了月份数据
            judgeUpdateMonth() {
                // 获取所有月份（包含年份）
                let monthSets = new Set();

                this.forEach((rowEle, rowId) => {
                    if (rowId == 0) {
                        return;
                    }

                    let date = new Date(parseInt(rowEle[1].val));
                    let monthTime = date.getFullYear() + "-" + (date.getMonth() + 1);
                    monthSets.add(monthTime);
                });

                let monthSetsArr = Array.from(monthSets);
                if (this._old_monthSets != JSON.stringify(monthSetsArr)) {
                    this.emit('updateMonth', {
                        times: monthSetsArr
                    });

                    this._old_monthSets = JSON.stringify(monthSetsArr);
                }
            },
            // 导入Category的方法
            importCategory(category) {
                initCategory(category);

                return this;
            },
            // 更新统计总价的方法
            reloadAmount() {
                let amount = 0;
                this.forEach((rowEle, rowId) => {
                    if (rowId === 0) {
                        return;
                    }

                    if (!rowEle.attrs.hide) {
                        let m = parseFloat(rowEle[3].val);

                        // 判断收入还是支出
                        if (rowEle[0].val == 0) {
                            m = -m;
                        }

                        amount += m;
                    }

                    // 修正颜色
                    if (rowEle[0].val == 0) {
                        // 支出
                        rowEle.style.backgroundColor = "rgba(255,0,0,.04)";
                        rowEle[3].style.color = "#e40909";
                    } else {
                        // 收入
                        rowEle.style.backgroundColor = "rgba(0,255,0,.04)";

                        if (parseFloat(rowEle[3].val) > 0) {
                            rowEle[3].style.color = '#06b906';
                        } else {
                            rowEle[3].style.color = "#e40909";
                        }
                    }
                });
                this.amount = parseFloat(amount).toFixed(2);
            }
        }
    };
});