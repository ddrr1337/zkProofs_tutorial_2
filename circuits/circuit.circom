pragma circom 2.1.6;


include "../node_modules/circomlib/circuits/poseidon.circom";

template Example () {
    signal input address;   //public      
    signal input secret_private; //private        
    signal input hashTarget; //public
    //signal output nullifier; //output

    component hash = Poseidon(2);
    hash.inputs[0] <== address;
    hash.inputs[1] <== secret_private;

    signal hashOut;
    hashOut <== hash.out;
    hashOut  === hashTarget; 


    /* component hashNullifier = Poseidon(2);
    hashNullifier.inputs[0] <== secret_private;
    hashNullifier.inputs[1] <== hash.out;
    
    nullifier <== hashNullifier.out; */
    
}

component main { public [ address, hashTarget ] } = Example();