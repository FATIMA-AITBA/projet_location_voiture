/*import request, {gql} from 'graphql-request';

export const getCarList = async () => {
    const query = gql`
    query cardliste {
  carLists {
    createdAt
    places
    publishedAt
    name
    marque
    id
    image {
      url
    }
    typeBoite
    fuelType
    updatedAt
    lieuDeRetour
    lieuDeRetrait
    carType
    prixParJour
    kilometrageInclus
    tarifKmSupp
    tarifKmIlimitesParJour
  }

  reservations {
      dateDeDepart
      dateDeRetour
      id
      carList{
        id
        name
        marque
      }
      
    }
}
    `;
    const result = await request("https://eu-west-2.cdn.hygraph.com/content/cm98d93mt00c908wbcfhpn9ui/master", query);
    return result;

}
*/



export const getCarList = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/voitures/AllVoituresEtReservations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur dans getCarList:', error);
    return null;
  }
};

