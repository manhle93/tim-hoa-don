<template>
    <div>
        <input type="file" id="input" @change="uploadExcel($event)" />
        <div style="display: flex; justify-content: center; margin-top: 50px">
            <div style="margin-right: 30px">
                <b style="margin-right: 6px">Tổng tiền</b>
                <input type="number" min="0" v-model="tongTien" class="input-value" />
            </div>
            <div>
                <b style="margin-right: 6px">Sai lệch</b>
                <input type="number" min="0" v-model="saiLech" class="input-value" />
            </div>
            <button class="ml-3 px-4 bg-primary-normal text-white hover:bg-primary-light" @click="timHoaDon">Tìm hóa
                đơn</button>
        </div>
        <div style="margin-top: 50px;">
            <b>Kết quả</b>
        </div>
        <div style="display: flex; flex-wrap: wrap; margin-top: 10px; " v-if="ketQua && ketQua.length > 0">
            <div v-for="(item, index) in ketQua" :key="index" style="width: 300px; border: 1px solid #2471A3;"
                class="mt-4 mr-4 ml-4 mb-3">
                <table style="width: 100%">
                    <tr>
                        <th>Số Hóa đơn</th>
                        <th>Số tiền</th>
                    </tr>
                    <tr v-for="(it, id) in item" :key="id">
                        <td>{{it.soHd}}</td>
                        <td>{{Number(it.tien).toLocaleString('de-DE')}}</td>
                    </tr>
                </table>
                <br />
                <b>Tổng tiền: {{Number(tongTienShowItem(item)).toLocaleString('de-DE')}}</b>
            </div>
        </div>
        <div v-else style="margin-top: 10px">Không có kết quả</div>
        <div style="margin-top: 50px;">
            <b>Nội dung File</b>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 10px">
            <table>
                <tr>
                    <th>Số Hóa đơn</th>
                    <th>Số tiền</th>
                </tr>
                <tr v-for="(item, index) in tableData" :key="index">
                    <td>{{item.soHd}}</td>
                    <td>{{Number(item.tien).toLocaleString('de-DE')}}</td>
                </tr>
            </table>
        </div>

    </div>
</template>

<script>
import readXlsxFile from 'read-excel-file'

export default {
    data() {
        return {
            tongTien: 0,
            saiLech: 0,
            tableData: [

            ],
            originData: [],
            ketQua: [],
        }
    },
    mounted() {
    },
    methods: {
        async uploadExcel(e) {
            let data = await readXlsxFile(e.target.files[0])
            let a = data.map((el, index) => {
                if (index > 0) {
                    return {
                        soHd: el[0],
                        tien: el[1]
                    }
                }
            })
            a.splice(0, 1)
            this.originData = [...a]
            this.tableData = [...a]
            this.timHoaDon()
        },

        timHoaDon() {
            this.ketQua = []
            const lisData = this.originData
            const countData = lisData.length
            for (let i = 0; i < countData - 1; i++) {
                let arrayTong = [lisData[i]]
                let check1 = this.tinhTong(arrayTong)
                if (check1 == 'NEXT') {
                    for (let j = i + 1; j < countData; j++) {
                        let check = this.tinhTong([...arrayTong, lisData[j]])
                        if (check == 'NEXT') {
                            arrayTong = [...arrayTong, lisData[j]]
                        }

                    }
                }

            }
        },
        tinhTong(array) {
            const sum = array.reduce((partialSum, a) => partialSum + a.tien, 0);
            if (sum > (Number(this.tongTien) + Number(this.saiLech))) {
                return 'REJECT'
            }
            else if (sum < (Number(this.tongTien) - Number(this.saiLech))) {
                return 'NEXT'
            }
            else if ((sum <= (Number(this.tongTien) + Number(this.saiLech))) && (sum >= (Number(this.tongTien) - Number(this.saiLech)))) {
                this.ketQua.push(array)
                return 'REJECT'
            }
        },
        tongTienShowItem(array) {
            const sum = array.reduce((partialSum, a) => partialSum + a.tien, 0);
            return sum
        }

    },
    watch: {
        tongTien: function (val) {
            this.ketQua = []
        },
    }
}
</script>
<style>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 800px;
}

td,
th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}

.input-value {
    border: 1px solid #BDC3C7;
}
</style>