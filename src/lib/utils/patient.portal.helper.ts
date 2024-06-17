
export class PatientPortalHelper {
    static getLoginStatus = (data) => {
        if (data.HttpCode === 404 && data.Message === 'Active OTP record not found!') {
            return 'invalidotp';
        }
       
        if (data.HttpCode === 400 && data.Message === 'Login OTP has expired. Please regenerate OTP again!') {
          return 'regenerate';
        } 

        return 'Oops! Something went wrong';
    }

    static getPatientDeleteStatus = (data) => {
        if (data.HttpCode !== 200) {
            return 'Oops! Something went wrong.';
        }
        
        return 'success';
    }
}
