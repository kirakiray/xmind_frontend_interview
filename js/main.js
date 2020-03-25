ofa = async () => {
    // 读取默认文件
    let bill = await fetch("./bill.csv");
    let categories = await fetch("./categories.csv");
    let bill_text = await bill.text();
    let categories_text = await categories.text();

    // 转换状态数据
    let categories_str_arr = categories_text.split(/\n/g);
    let categoriesData = [];
    categories_str_arr.forEach((e, i) => {
        if (i == 0) return;
        let [cid, ctype, cname] = e.split(",");
        categoriesData.push({
            ctype, cname, cid
        });
    });

    ofa.config({
        baseUrl: "js/"
    });
    const csvToTable = await load("util/csvToTable");

    // 加载poc-table组件
    await load("components/poc-table -pack", "components/left-pannel -pack");

    // 更新月份就更新选项
    $("poc-table").on("updateMonth", (e, data) => {
        $("left-pannel").importTime(data.times);
    });

    // 添加状态数据
    $("poc-table").category = categoriesData;

    // 添加新表单元素
    $("poc-table").push(csvToTable(bill_text));

    // 打开显示
    $("poc-table").display = "";

    $(".loading_con").display = "none";

    // 添加状态数据
    $("left-pannel").category = categoriesData;

    // 新增模块可以不做到left-pannel内
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

    // 数据同步
    $("left-pannel").sync($('poc-table'), ["sortType", "sTime", "sType", "sCate"], true);
}