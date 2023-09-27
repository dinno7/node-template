# Some details about project structure for developers
> This is a practice project from this [Udemy course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) made by [Jonas Schmedtmann](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/#instructor-1), but I've made a few changes, especially to the **design pattern**.
## Add new module

#### Create new folder equal to module name inside src/modules/v\*

\- You can create and use any file that related to your module such as:

- _moduleName.model.js_
- _moduleName.controller.js_
- _moduleName.routes.js_
- _moduleName.utils.js_

and so on...

#### Then you must add your module's routes to _src/modules/v\*/routes.js_ inside _routes_ object

> **Attention** Your key in routes object is your api url, for example if your key inside routes object is users then your api url will be _https://baseurl.com/api/v*/**users**_

## Error handling

All **async controllers** need to have (req, res, **next**) and also pass to catchError function in _src/utils_ as a parameter, by doing this you do not need try/catch block in controllers and if you wanna throw error in controllers you need to pass error object inside next() function as a parameter:

```
next(new Error('There is some error...'))
```

Also you can use **new AppError(\<Error_Message\>, \<Statud_Code\>)** in _src/utils_ instead of new Error(\<Error_Message\>)

example:

```
next(new AppError('There is some server's error...', 500))
```

## Add new middleware

You can add new middleware file in _src/middlewares_

Also you can add global middlewares or 3-party middlewares in _src/middlewares/index.js_

## Add new util

You can add new util file in _src/utils_ and then make it exportable from _src/utils_ inside _src/utils/index.js_
