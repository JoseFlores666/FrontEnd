
import Swal from 'sweetalert';

const SweetAlert = {
  showAlert: (title, message, type = 'info',botones={ok:"Aceptar"}) => {
    return Swal({
      title: title,
      text: message,
      icon: type,
      buttons: botones
    });
  },
};

export default SweetAlert;
