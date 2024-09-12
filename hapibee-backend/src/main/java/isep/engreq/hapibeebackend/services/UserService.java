package isep.engreq.hapibeebackend.services;

import isep.engreq.hapibeebackend.documents.UserDocument;
import isep.engreq.hapibeebackend.dtos.CreateUserDto;
import isep.engreq.hapibeebackend.dtos.UserDto;
import isep.engreq.hapibeebackend.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    private final ModelMapper mapper = new ModelMapper();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDto findById(String id) {

        Optional<UserDocument> user = this.userRepository.findById(id);

        return this.mapper.map(user, UserDto.class);
    }

    @Transactional
    public UserDto findByEmail(String email) {

        Optional<UserDocument> user = this.userRepository.findByEmail(email);
        UserDto userDto = new UserDto();

        user.ifPresent(u -> {
            userDto.setTenantId(u.getTenantId());
            userDto.setEmail(u.getEmail());
            userDto.setPassword(u.getPassword());
            userDto.setName(u.getName());
            userDto.setRole(u.getRole());
            userDto.setNif(u.getNif());
            userDto.setAddress(u.getAddress());
        });

        return userDto;
    }

    public List<UserDto> getAllByTenant(String tenantId) {
        List<UserDocument> userDocuments = userRepository.findAllByTenantId(tenantId);
        List<UserDto> usersDto = new ArrayList<>();

        for (UserDocument userDocument : userDocuments) {
            usersDto.add(this.mapper.map(userDocument, UserDto.class));
        }
        return usersDto;
    }

    @Transactional
    public UserDto create(CreateUserDto createUserDTO) {

        UserDocument user = new UserDocument();

        user.setTenantId(createUserDTO.getTenantId());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setName(createUserDTO.getName());
        user.setRole(createUserDTO.getRole());
        user.setNif(createUserDTO.getNif());
        user.setAddress(createUserDTO.getAddress());

        this.userRepository.save(user);

        return this.mapper.map(user, UserDto.class);
    }

    @Transactional
    public void delete(String tenantId, String email) {
        Optional<UserDocument> userOpt = this.userRepository.findByTenantIdAndEmail(tenantId, email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("O user não existe");
        }
        this.userRepository.deleteByTenantIdAndEmail(tenantId, email);
    }
}
