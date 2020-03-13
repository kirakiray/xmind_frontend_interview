ofa = async () => {
    // 读取默认文件
    let bill = await fetch("./bill.csv");
    let categories = await fetch("./categories.csv");
    let bill_text = await bill.text();
    let categories_text = await categories.text();

    ofa.config({
        baseUrl: "js/"
    });

    // 加载poc-table组件
    await load("components/poc-table -pack", "components/left-pannel -pack");

    // 更新月份就更新选项
    $("poc-table").on("updateMonth", (e, data) => {
        $("left-pannel").importTime(data.times);
    });

    // 使用专属方法添加导入csv
    $("poc-table")
        .importCategory(categories_text)
        .importCSV(bill_text);

    // 打开显示
    $("poc-table").display = "";

    // 刷新统计
    $("poc-table").reloadAmount();

    $("left-pannel").importCategory(categories_text);

    // 监听pannel变动
    const pannelChange = () => {
        let { sTime, sType, sCate } = $("left-pannel");

        $("poc-table").queAll('poc-tr').forEach((tr, rowId) => {
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
        $("poc-table").reloadAmount();
    }
    $("left-pannel").watch("sTime", pannelChange);
    $("left-pannel").watch("sType", pannelChange);
    $("left-pannel").watch("sCate", pannelChange);

    $("left-pannel").on("addItem", (e, data) => {
        // 添加新项目
        let { fType, fTime, fCate, fAmount } = data;

        let trEle = $(`
        <poc-tr>
            <poc-td type="TYPE" val="${fType}"></poc-td>
            <poc-td type="TIME" val="${new Date(fTime).getTime()}"></poc-td>
            <poc-td type="CATEGORY" val="${fCate}"></poc-td>
            <poc-td type="AMOUNT" val="${fAmount}"></poc-td>
        </poc-tr>
        `);

        $('poc-table').push(trEle);

        setTimeout(() => {
            trEle.ele.scrollIntoView({
                behavior: "smooth"
            });
        }, 300);
    });

    // 改变排序
    $("left-pannel").watch("sortType", (e, sortType) => {
        console.log("sortType => ", sortType);
        setTimeout(() => {
            $("poc-table").display = "none";
            switch (sortType) {
                case "time":
                    $("poc-table").forEach((tr, i) => {
                        if (i == 0) return;

                        tr.style.order = parseInt(tr[1].val / 86400000);
                    });
                    break;
                case "timeRev":
                    $("poc-table").forEach((tr, i) => {
                        if (i == 0) return;

                        tr.style.order = -parseInt(tr[1].val / 86400000);
                    });

                    break;
                default:
                    $("poc-table").forEach((tr, i) => {
                        if (i == 0) return;
                        tr.style.order = null
                    });
            }
            $("poc-table").display = "";
        }, 100);
    }, true);
}