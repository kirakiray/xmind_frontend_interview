

describe("importCSV test", function () {
    let calls = [];

    it("length test", function (done) {
        calls.push(() => {
            expect(document.querySelector("poc-table").children.length).toBe(47);
            expect(document.querySelector("poc-table poc-tr").children.length).toBe(4);

            setTimeout(() => {
                expect($('poc-table').amount).toBe("29200.00");
                done();
            }, 100);
        });
    });


    // 初始化方法
    ofa = async () => {
        ofa.config({
            baseUrl: "../js/"
        });

        await load("components/poc-table -pack");

        let bill = await fetch("../bill.csv");
        let categories = await fetch("../categories.csv");
        let bill_text = await bill.text();
        let categories_text = await categories.text();

        // 使用专属方法添加导入csv
        $("poc-table")
            .importCategory(categories_text)
            .importCSV(bill_text);

        // 初始化完成后执行队列
        calls.forEach(f => f());
    }
});