import Mock from 'mockjs'

// 定义Mock数据
const mockUsers = Mock.mock({
    'list|1713': [
        {
            'stationIdC': '@string("5")',
            'stationName': '@ctitle(2, 10)',
            'cityCode': '@string("6")',
            'lon|121-132.1-5': 1,
            'lat|40-47.1-5': 1,
            'value': '@float(0, 25, 0, 2)',
            'dateTime': '@date("yyyy-MM-dd HH:mm:ss")',
            'cityCn': '@city',
            "cnty": "@county",
        }
    ],
}).list

export default [
    // 获取站点列表
    {
        url: '/V1/weather/liveBroadcast/stationLive/liveData',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: 'success',
                data: mockUsers,
            }
        },
    },
]