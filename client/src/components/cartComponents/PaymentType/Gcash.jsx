import axios from "axios";
import Cookies from "js-cookie"
import {useSelector} from "react-redux";

function Gcash({ items, totalAmount, toast,setOpenBilling }) {
  const {currentUser} = useSelector(state => state?.user);
  
  const gcashPayment = async () => {

    try {
      if(totalAmount <= 0) {
        return toast('Checkout an item first', {type: 'info'})
      }

      setOpenBilling(true)

    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div style={{ marginBlock: 20 }}>
      <a
        onClick={gcashPayment}
        class="x-getpaid-button"
        style={{ cursor: "pointer" }}
      >
        <img src="https://getpaid.gcash.com/assets/img/paynow.png" />
      </a>
    </div>
  );
}

export default Gcash;
