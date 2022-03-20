module.exports = function(app, data){
          app.get('/get-rgb-data', (req, res) => {
          console.log(JSON.stringify(data));
        res.end(JSON.stringify(data));
  });
}