class UserService {
    getSubscribedUsers() {
        // this method will call user-service API to get user data
        return [
            {
                id: "1",
                platform: "W,E",
                countryCode: "62",
                phoneNumber: "85270473206",
                email: "fauzulazkia2002@gmail.com"
            },
            {
                id: "2",
                platform: "W,E",
                countryCode: "62",
                phoneNumber: "81324886560",
                email: null
            }
        ]
    }
}

module.exports = UserService;