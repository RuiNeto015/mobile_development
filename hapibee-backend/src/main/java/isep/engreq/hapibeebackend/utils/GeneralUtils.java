package isep.engreq.hapibeebackend.utils;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class GeneralUtils {

    public static String getControlledZone() {
        List<String> cities = Arrays.asList(
                "Ribeira de Pena",
                "Vila Pouca de Aguiar",
                "Caminha",
                "Viana do Castelo",
                "Ponte de Lima",
                "Arcos de Valdevez",
                "Ponte da Barca",
                "Vila Nova de Cerveira",
                "Valença",
                "Monção",
                "Paredes de Coura",
                "Melgaço",
                "Bragança",
                "Miranda do Douro",
                "Vimioso",
                "Vinhais",
                "Boticas",
                "Montalegre",
                "Alfandega da Fé",
                "Macedo de Cavaleiros",
                "Mirandela",
                "Vila Flor",
                "Chaves",
                "Valpaços",
                "Aguiar da Beira",
                "Carregal de Sal",
                "Mangualde",
                "Nelas",
                "Penalva do Castelo",
                "Sátão",
                "Sernancelhe",
                "Tondela",
                "Viseu",
                "Anadia",
                "Cantanhede",
                "Coimbra",
                "Figueira da Foz",
                "Mealhada",
                "Mira",
                "Montemor-o-Velho",
                "Mortágua",
                "Penacova",
                "Santa Comba Dão",
                "Castelo Branco",
                "Idanha-a-Nova",
                "Mação"
        );

        Random random = new Random();
        int randomIndex = random.nextInt(cities.size());

        return cities.get(randomIndex);
    }
}
