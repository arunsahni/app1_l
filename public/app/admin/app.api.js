var baseUrl = "";
var webservices = {
    "stafflogin": baseUrl + "/staff/login",
    "gettutors": baseUrl + "/staff/view-all-tutors",
    "viewTutor": baseUrl + "/staff/view-tutor",
    "editTutor": baseUrl + "/staff/update-tutor",
    "removeTutor": baseUrl + "/staff/delete-tutor",
    "getLearnerNotifications": baseUrl + "/student/get-notifications",
    "uploadLearnerProfilePic" : baseUrl + "/student/upload-profilepic",
    "updatelearnerdetail" : baseUrl + "/student/update-learner-details",
    "updatelearneralertnotifications" : baseUrl + "/student/update-alertnotifications",
    "updatelearnerpassword" :baseUrl + "/student/change-password",
    "updatelearneremail" :baseUrl + "/student/send-verification-email",
    "updatelearnermobile" :baseUrl + "/student/verify-mobile",
    "verifylearnermobile" :baseUrl + "/student/verify-mobile-status",
    "getlearnernotificationsconfig" :baseUrl + "/student/get-alertnotifications",
    "getLearners": baseUrl + "/staff/view-all-students",
    "addLearner": baseUrl + "/staff/add-student",
    "viewLearner": baseUrl + "/staff/view-student",
    "editLearner": baseUrl + "/staff/update-student",
    "removeLearner": baseUrl + "/staff/delete-student",
    "countTutors": baseUrl + "/staff/count-tutors",
    "addTutor" : baseUrl + "/staff/add-tutor",
    "accountStatus": baseUrl + "/staff/account-status-tutor",
    
    "manageStatusLearner": baseUrl + "/staff/account-status-student",
    "countLearners": baseUrl + "/staff/count-learners",
    
    "verifyTutor": baseUrl + "/staff/verify-tutor",
    // announcements
    "getAnnouncements": baseUrl + "/announcement/manage-announcement",
    "addAnnouncement": baseUrl + "/announcement/add-announcement",
    "viewAnnouncement": baseUrl + "/announcement/fetch-announcement",
    "editAnnouncement": baseUrl + "/announcement/update-announcement",
    "removeAnnouncement": baseUrl + "/announcement/delete-announcement",
    "countAnnouncements": baseUrl + "/announcement/count-announcement",
    
    // Institutions
    "getInstitutions": baseUrl + "/institutions/manage-institutions",
    "addInstitution": baseUrl + "/institutions/add-institutions",
    "viewInstitution": baseUrl + "/institutions/fetch-institutions",
    "editInstitution": baseUrl + "/institutions/update-institutions",
    "removeInstitution": baseUrl + "/institutions/delete-institutions",
    "countInstitutions": baseUrl + "/institutions/count-institutions",
    
    // Subjects
    "getSubjects": baseUrl + "/subject/manage-subject",
    "addSubject": baseUrl + "/subject/add-subject",
    "viewSubject": baseUrl + "/subject/fetch-subject",
    "editSubject": baseUrl + "/subject/update-subject",
    "removeSubject": baseUrl + "/subject/delete-subject",
    "countSubjects": baseUrl + "/subject/count-subject",
    
    // Locations
    "getLocations": baseUrl + "/location/manage-locations",
    "addLocation": baseUrl + "/location/add-locations",
    "viewLocation": baseUrl + "/location/fetch-locations",
    "editLocation": baseUrl + "/location/update-locations",
    "removeLocation": baseUrl + "/location/delete-locations",
    "countLocations": baseUrl + "/location/count-locations",
    
    // banks
    "getBanks": baseUrl + "/banks/manage-banks",
    "addBank": baseUrl + "/banks/add-banks",
    "viewBank": baseUrl + "/banks/fetch-banks",
    "editBank": baseUrl + "/banks/update-banks",
    "removeBank": baseUrl + "/banks/delete-banks",
    "countBanks": baseUrl + "/banks/count-banks",
    
    // badges
    "getBadges": baseUrl + "/badges/manage-badges",
    "addBadge": baseUrl + "/badges/add-badges",
    "viewBadge": baseUrl + "/badges/fetch-badges",
    "editBadge": baseUrl + "/badges/update-badges",
    "removeBadge": baseUrl + "/badges/delete-badges",
    "countBadges": baseUrl + "/badges/count-badges",
    
    // specialised areas
    "getSpecialisedareas": baseUrl + "/teachingarea/manage-teachingarea",
    "addSpecialisedarea": baseUrl + "/teachingarea/add-teachingarea",
    "viewSpecialisedarea": baseUrl + "/teachingarea/fetch-teachingarea",
    "editSpecialisedarea": baseUrl + "/teachingarea/update-teachingarea",
    "removeSpecialisedarea": baseUrl + "/teachingarea/delete-teachingarea",
    "countSpecialisedareas": baseUrl + "/teachingarea/count-teachingarea",
    
    // special expertises
    "getSpecialexpertises": baseUrl + "/teachingexpert/manage-teachingexpert",
    "addSpecialexpertise": baseUrl + "/teachingexpert/add-teachingexpert",
    "viewSpecialexpertise": baseUrl + "/teachingexpert/fetch-teachingexpert",
    "editSpecialexpertise": baseUrl + "/teachingexpert/update-teachingexpert",
    "removeSpecialexpertise": baseUrl + "/teachingexpert/delete-teachingexpert",
    "countSpecialexpertises": baseUrl + "/teachingexpert/count-teachingexpert",
    
    // certificates
    "getCertificates": baseUrl + "/certificates/manage-certificates",
    "addCertificate": baseUrl + "/certificates/add-certificates",
    "viewCertificate": baseUrl + "/certificates/fetch-certificates",
    "editCertificate": baseUrl + "/certificates/update-certificates",
    "removeCertificate": baseUrl + "/certificates/delete-certificates",
    "countCertificates": baseUrl + "/certificates/count-certificates"
};
