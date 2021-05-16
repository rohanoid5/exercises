const promisify = (callback) => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const newArgs = [
        ...args,
        function (err, result) {
          if (err) {
            return reject(err);
          }

          resolve(result);
        },
      ];

      callback(...newArgs);
    });
  };
};

const async = {
  sequence: function (tasks) {
    return function (cb) {
      let task = promisify(tasks[0]);

      task().then((res1) => {
        for (let i = 1; i < tasks.length; i++) {
          task = promisify(tasks[i])(cb, res1).then((res) => res);
        }
      });
    };
  },
};

const getUser = function (userId) {
  return function (cb) {
    setTimeout(function () {
      cb(null, { userId: userId, name: "Joe" });
    }, Math.random() * 100);
  };
};

const upperCaseName = function (cb, user) {
  cb(null, user.name.toUpperCase());
};

const lowerCaseName = function (cb, user) {
  cb(null, user.name.toLowerCase());
};

const userThunk = getUser(22);

async.sequence([userThunk, upperCaseName])(function (err, data) {
  console.log(data);
});

module.exports = async;
