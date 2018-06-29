var account = {//....................................................Account object
    account: 'Dummy name',
    amount: 0
   }
   
   function Account(id, balance) {//.....................................Constructor for acount
    this.accountID = id;
    this.accountBalance = balance;
   }
   
   function addFunds(obj, value) {//....................................function to add funds
    var num;
    num = (obj.accountBalance += value);
    return num;
   }
   
   function withdrawalFunds(obj, value) {//.............................function to remove funds
    var num;
    num = (obj.accountBalance -= value);
    return num;
   }
   
   module.exports = {
    Account: Account,
    addFunds: addFunds,
    takeFunds: withdrawalFunds
   };
   