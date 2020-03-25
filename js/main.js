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

    $(".loading_con").display = "none";

    // 刷新统计
    $("poc-table").reloadAmount();

    $("left-pannel").importCategory(categories_text);

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

    // 改数据同步
    $("left-pannel").sync($('poc-table'), ["sortType", "sTime", "sType", "sCate"], true);
}