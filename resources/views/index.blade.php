@verbatim
<!doctype html>
<html lang="de" ng-app="Forum">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Forum</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="css/forum.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js"></script>
    <script src="https://cdn.jsdelivr.net/satellizer/0.15.5/satellizer.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.0-rc.1/angular-ui-router.min.js"></script>

    <script src="js/forum.js"></script>
    <script src="js/authenticate.js"></script>
    <script src="/js/filechooser.js"></script>
</head>
<body>
    <h1>Forum</h1>
    <div ng-controller="AuthenticationController" ng-show="authenticated">
        <h5><img ng-show="avatar" ng-src="{{avatar}}" style="width: 50px; height: auto"> Hallo, {{currentUser.name}}</h5>
        <div class="btn-group" style="margin-bottom: 10px;">
            <a href="/#/settings" class="btn bnt-primary">Settings</a>
            <button class="btn btn-danger" ng-click="logout()">Logout</button>
        </div>
    </div>
    <div ui-view></div>
</body>
</html>
@endverbatim