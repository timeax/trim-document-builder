import PaystackPop from '@paystack/inline-js';

export function handlePayment({ email, name, amount }) {
    return new Promise((resolve, reject) => {
        const paystack = new PaystackPop();

        const key = 'pk_test_ee8e5ff914e1bd17083e243fa576504a7fbba212';

        paystack.newTransaction({
            key: key,
            email: email,
            amount: amount * 100,
            onSuccess: (transaction) => {
                resolve({ failed: false, ...transaction });
            },
            onCancel: () => {
                reject({ failed: true })
            }
        })

    });
}