const axios = require('axios');
axios.get('http://localhost:3003/servers').then(resp => {
    console.log(resp.data.filter(item => {
        return item.server_id === '141956898206384128'
    }))
    
}).catch(err => {
    console.log(err.message);
})