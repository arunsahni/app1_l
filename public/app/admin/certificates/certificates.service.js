(function () {
    'use strict';

    angular
            .module('adminapp')
            .factory('certificatesService', certificatesService);

    certificatesService.$inject = ['$http','$q'];
    function certificatesService($http,$q) {

        var service = {
            getCertificates: getCertificates,
            getCountCertificates: getCountCertificates,
            getCertificate: getCertificate,
            addCertificate: addCertificate,
            editCertificate: editCertificate,
            removeCertificate: removeCertificate,
            deleteImageCertificates: deleteImageCertificates
            
        };

        return service;

        function getCertificates(postData ,callback) {
            $http.post(webservices.getCertificates, postData)
            .success(function (response) {
                if(response.status === 200) {
                    callback(response.data);
                }
            })
            .error(function (data) {
                //callback(data);
            });
        };
        
        function getCountCertificates(callback) {
            $q.all(
            [
                $http.post(webservices.getCertificates),
                $http.get(webservices.countCertificates),
            ]
            ).then(
            function (response) {
                callback(response);
            },
            function (error) {
                console.log(error);
            });
        };
        
        
        function addCertificate(postData,callback) {
            
            $http.post(webservices.addCertificate, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response);
                        }
                        
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        function getCertificate(postData,callback) {
            var serviceUrl = webservices.viewCertificate +'/' + postData;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response.data);
                        }
                        
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        
          
        function editCertificate(postData,callback) {
            
            $http.post(webservices.editCertificate, postData)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(response);
                        }
                        
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        function removeCertificate(postData,callback) {
           
            var serviceUrl = webservices.removeCertificate +'/' + postData.id;
            $http.get(serviceUrl)
                    .success(function (response) {
                        if(response.status === 200) {
                            callback(true);
                        }
                    })
                    .error(function (response) {
                        //callback(data);
                    });
        }
        ;
        
        function deleteImageCertificates(jsonString,callback) {
            var httpObj = $http.post('/announcement/deleteImage-announcement/',jsonString);
            httpObj.then(function (result) {
                callback(result);
            });
        }
        ;

    }

})();


