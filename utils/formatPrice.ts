export const formatPrice = (amount: number) => {
    
return new Intl.NumberFormat('en-US',{
    style:'currency',
    currency:'USD'
}).format(amount)
}

export const formatPriceToDollars = (amount: number): string => {
    // Convert cents to dollars
    const amountInDollars = amount / 100;
  
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amountInDollars);
  };